/**
 * routes/talentforge.js — TalentForge Agent Swarm API
 *
 * POST /api/talentforge/run      — trigger full pipeline (returns sessionId)
 * GET  /api/talentforge/stream/:sessionId — SSE stream of agent events
 * POST /api/talentforge/analyze-jd — Agent 1+2 only (assessment generation)
 * GET  /api/talentforge/demo      — pre-seeded demo run (no auth, for judges)
 */

import express from 'express';
import { randomUUID } from 'crypto';
import { orchestrator } from '../agent/TalentForgeOrchestrator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// In-memory SSE client registry  { sessionId → [res, ...] }
const sseClients = new Map();

// Broadcast event to all SSE listeners for a session
orchestrator.on('event', (event) => {
  const clients = sseClients.get(event.sessionId) || [];
  const data = `data: ${JSON.stringify(event)}\n\n`;
  clients.forEach(res => {
    try { res.write(data); } catch (_) {}
  });
  // On terminal events, close after short delay
  if (['pipeline_complete', 'pipeline_error', 'pipeline_partial'].includes(event.type)) {
    setTimeout(() => {
      clients.forEach(res => { try { res.end(); } catch (_) {} });
      sseClients.delete(event.sessionId);
    }, 2000);
  }
});

/**
 * GET /api/talentforge/stream/:sessionId
 * SSE — frontend connects here to receive live agent events
 */
router.get('/stream/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Register this response
  if (!sseClients.has(sessionId)) sseClients.set(sessionId, []);
  sseClients.get(sessionId).push(res);

  // Heartbeat
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch (_) { clearInterval(heartbeat); }
  }, 15000);

  // Send connected confirmation
  res.write(`data: ${JSON.stringify({ type: 'connected', sessionId, timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    clearInterval(heartbeat);
    const list = sseClients.get(sessionId) || [];
    const idx = list.indexOf(res);
    if (idx > -1) list.splice(idx, 1);
  });
});

/**
 * POST /api/talentforge/run
 * Full pipeline trigger — returns sessionId immediately, streams events
 * Body: { jdText, jobRole, employeeData, responses? }
 */
router.post('/run', authenticate, async (req, res) => {
  try {
    const { jdText, jobRole, employeeData = {}, responses } = req.body;
    const sessionId = randomUUID();

    // Start pipeline async (don't await — SSE handles progress)
    orchestrator.run({
      sessionId,
      jdText: jdText || '',
      jobRole: jobRole || req.user?.jobRole || 'Professional',
      employeeData: {
        name: employeeData.name || req.user?.name || 'Employee',
        seed: `${req.user?.userId || 'demo'}-${Date.now()}`,
        ...employeeData,
      },
      responses,
    }).catch(err => console.error('[TalentForge] Pipeline error:', err.message));

    res.json({ success: true, sessionId, message: 'Pipeline started — connect to /stream/:sessionId for live updates' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * POST /api/talentforge/analyze-jd
 * Agents 1+2 only — generate assessment from JD (no prior responses needed)
 * Returns sessionId + questions when complete
 */
router.post('/analyze-jd', authenticate, async (req, res) => {
  try {
    const { jdText, jobRole, userId } = req.body;
    const sessionId = randomUUID();

    // Run pipeline (partial — no responses)
    orchestrator.run({
      sessionId,
      jdText: jdText || '',
      jobRole: jobRole || 'Professional',
      employeeData: {
        name: req.user?.name || 'Employee',
        seed: `${userId || req.user?.userId}-${Date.now()}`,
      },
      responses: null, // triggers partial run
    }).catch(err => console.error('[TalentForge] Analyze error:', err.message));

    res.json({ success: true, sessionId });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * GET /api/talentforge/demo
 * No-auth demo run for judges — uses pre-seeded data
 */
router.get('/demo', async (req, res) => {
  try {
    const sessionId = randomUUID();

    const demoJD = `Software Engineer — Full Stack
We are looking for a skilled Full Stack Software Engineer to join our product team.

Responsibilities:
- Design and develop scalable web applications using React and Node.js
- Build and maintain RESTful APIs and microservices
- Implement CI/CD pipelines and DevOps best practices
- Collaborate with product and design teams on feature development
- Conduct code reviews and mentor junior developers

Requirements:
- 3+ years experience with React, TypeScript, Node.js
- Strong understanding of cloud architecture (AWS/GCP/Azure)
- Experience with Docker, Kubernetes, and container orchestration
- Proficiency in SQL and NoSQL databases
- Knowledge of system design and distributed systems`;

    const demoResponses = [
      { answer: 'A' }, { answer: 'B' }, { answer: 'A' }, { answer: 'C' }, { answer: 'A' },
      { answer: 'B' }, { answer: 'A' }, { answer: 'D' }, { answer: 'A' }, { answer: 'B' },
    ];

    orchestrator.run({
      sessionId,
      jdText: demoJD,
      jobRole: 'Software Engineer',
      employeeData: { name: 'Alex Chen', seed: 'demo-judge-2026' },
      responses: demoResponses,
    }).catch(err => console.error('[TalentForge] Demo error:', err.message));

    res.json({ success: true, sessionId, message: 'Demo pipeline started' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
