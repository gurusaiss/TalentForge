/**
 * TalentForgeOrchestrator — 5-Agent Swarm Pipeline
 *
 * Orchestrates a sequential pipeline of 5 specialized AI agents:
 *   Agent 1: JD Analyzer      — extracts skills & competencies from job description
 *   Agent 2: Assessment Agent — generates personalized MCQ assessment
 *   Agent 3: Gap Analysis     — scores results, maps skill gaps
 *   Agent 4: Learning Path    — designs targeted learning module
 *   Agent 5: Career Intel     — builds career profile & learning DNA
 *
 * Each agent emits SSE events so the frontend can stream live status.
 */

import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGroq(systemPrompt, userPrompt, jsonMode = true) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');
  const r = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 4096,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
    signal: AbortSignal.timeout(45000),
  });
  if (!r.ok) throw new Error(`Groq HTTP ${r.status}`);
  const d = await r.json();
  const text = d.choices?.[0]?.message?.content || '{}';
  return jsonMode ? JSON.parse(text) : text;
}

async function callGemini(prompt, jsonMode = true) {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  if (!key) throw new Error('GEMINI_API_KEY not set');
  const r = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 4096,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    }),
    signal: AbortSignal.timeout(45000),
  });
  if (!r.ok) throw new Error(`Gemini HTTP ${r.status}`);
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return jsonMode ? JSON.parse(text) : text;
}

async function callAI(systemPrompt, userPrompt, { useGroq = false, jsonMode = true } = {}) {
  if (useGroq && process.env.GROQ_API_KEY) {
    try { return await callGroq(systemPrompt, userPrompt, jsonMode); } catch (e) {
      console.warn('[Orchestrator] Groq failed, falling back to Gemini:', e.message);
    }
  }
  return await callGemini(systemPrompt + '\n\n' + userPrompt, jsonMode);
}

// ── Agent 1: JD Analyzer ──────────────────────────────────────────────────────
async function runJDAnalyzer(jdText, jobRole, emit) {
  emit('thinking', 'Reading job description... Extracting competency framework...');
  await delay(400);

  const system = `You are an expert HR analyst and skills ontology specialist.
Extract a structured competency framework from job descriptions.
Return ONLY valid JSON.`;

  const prompt = `Analyze this job description for the role of "${jobRole}".

Job Description:
${jdText || `${jobRole} - responsible for core duties and deliverables`}

Return JSON with this exact structure:
{
  "roleTitle": "...",
  "seniorityLevel": "junior|mid|senior|lead",
  "coreSkills": ["skill1", "skill2", ...],
  "technicalCompetencies": [
    { "name": "...", "importance": "critical|important|nice-to-have", "expectedLevel": 0-100 }
  ],
  "softSkills": ["..."],
  "keyResponsibilities": ["..."],
  "industryDomain": "...",
  "assessmentFocus": ["top 3-5 areas most critical to assess"]
}`;

  emit('thinking', 'Parsing competency matrix... Identifying skill clusters...');
  const result = await callAI(system, prompt, { useGroq: true, jsonMode: true });
  emit('thinking', `Extracted ${result.coreSkills?.length || 0} core skills, ${result.technicalCompetencies?.length || 0} competencies`);
  return result;
}

// ── Agent 2: Assessment Agent ─────────────────────────────────────────────────
async function runAssessmentAgent(jdAnalysis, employeeData, emit) {
  emit('thinking', 'Designing psychometric assessment blueprint...');
  await delay(300);

  const system = `You are a psychometric assessment designer specializing in job-specific evaluations.
Create MCQ questions that test actual on-the-job competency, not trivia.
Return ONLY valid JSON.`;

  const focusAreas = jdAnalysis.assessmentFocus?.join(', ') || jdAnalysis.coreSkills?.slice(0, 4).join(', ');
  const prompt = `Design a 10-question MCQ assessment for:
Role: ${jdAnalysis.roleTitle || employeeData.jobRole}
Seniority: ${jdAnalysis.seniorityLevel || 'mid'}
Assessment Focus: ${focusAreas}
Technical Areas: ${jdAnalysis.technicalCompetencies?.map(t => t.name).join(', ')}

Employee Seed (ensure unique questions): ${employeeData.seed || randomUUID().slice(0, 8)}

Return JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A",
      "difficulty": "easy|medium|hard",
      "skillArea": "...",
      "explanation": "..."
    }
  ]
}
Mix: 30% easy, 50% medium, 20% hard. Make questions scenario-based, not definition-based.`;

  emit('thinking', `Calibrating ${jdAnalysis.technicalCompetencies?.length || 5} competency domains... Building question bank...`);
  const result = await callAI(system, prompt, { useGroq: false, jsonMode: true });
  const questions = result.questions || [];
  emit('thinking', `Generated ${questions.length} personalized assessment questions`);
  return questions;
}

// ── Agent 3: Gap Analysis Agent ───────────────────────────────────────────────
async function runGapAnalysisAgent(questions, responses, jdAnalysis, emit) {
  emit('thinking', 'Processing assessment responses... Computing skill gap vectors...');
  await delay(300);

  // Score locally
  let correct = 0;
  const breakdown = questions.map((q, i) => {
    const resp = responses?.[i] || {};
    const extract = s => (s || '').trim().toUpperCase().replace(/^([A-D])[)\s.].*$/, '$1').charAt(0);
    const isCorrect = extract(resp.answer) === extract(q.answer);
    if (isCorrect) correct++;
    return { question: q.question, skillArea: q.skillArea, difficulty: q.difficulty, isCorrect, userAnswer: resp.answer, correctAnswer: q.answer };
  });

  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

  // Skill area analysis
  const skillMap = {};
  breakdown.forEach(b => {
    if (!skillMap[b.skillArea]) skillMap[b.skillArea] = { correct: 0, total: 0 };
    skillMap[b.skillArea].total++;
    if (b.isCorrect) skillMap[b.skillArea].correct++;
  });

  const skillGaps = Object.entries(skillMap).map(([skill, data]) => ({
    skill,
    score: Math.round((data.correct / data.total) * 100),
    gap: 100 - Math.round((data.correct / data.total) * 100),
    status: data.correct / data.total >= 0.7 ? 'strength' : 'gap',
  })).sort((a, b) => a.score - b.score);

  emit('thinking', `Score: ${score}% (${grade}). Identified ${skillGaps.filter(s => s.status === 'gap').length} skill gaps requiring attention`);

  // Use AI to generate rich gap narrative
  const system = `You are a talent development analyst. Generate actionable skill gap insights.
Return ONLY valid JSON.`;

  const weakAreas = skillGaps.filter(s => s.status === 'gap').map(s => s.skill);
  const prompt = `Employee scored ${score}% on ${jdAnalysis.roleTitle || 'role'} assessment.
Weak areas: ${weakAreas.join(', ') || 'None identified'}
Strong areas: ${skillGaps.filter(s => s.status === 'strength').map(s => s.skill).join(', ') || 'None'}

Generate gap analysis:
{
  "overallScore": ${score},
  "grade": "${grade}",
  "priorityGaps": ["top 3 gaps to address first"],
  "developmentUrgency": "immediate|moderate|low",
  "estimatedRampUpWeeks": 2-12,
  "keyInsight": "one sentence insight about this employee's readiness",
  "recommendedLearningStyle": "hands-on|conceptual|mixed"
}`;

  const aiInsights = await callAI(system, prompt, { useGroq: true, jsonMode: true });

  return {
    score,
    grade,
    breakdown,
    skillGaps,
    weakAreas,
    strengths: skillGaps.filter(s => s.status === 'strength').map(s => s.skill),
    ...aiInsights,
  };
}

// ── Agent 4: Learning Path Agent ──────────────────────────────────────────────
async function runLearningPathAgent(gapAnalysis, jdAnalysis, employeeName, emit) {
  emit('thinking', 'Designing personalized learning curriculum...');
  await delay(400);

  const system = `You are a corporate learning experience designer.
Create targeted, practical learning modules based on skill gap analysis.
Return ONLY valid JSON.`;

  const gaps = gapAnalysis.priorityGaps || gapAnalysis.weakAreas || [];
  const prompt = `Design a learning module for: ${employeeName || 'Employee'}
Role: ${jdAnalysis.roleTitle || 'Professional'}
Priority gaps: ${gaps.join(', ')}
Development urgency: ${gapAnalysis.developmentUrgency || 'moderate'}
Recommended style: ${gapAnalysis.recommendedLearningStyle || 'mixed'}

Return a complete learning module:
{
  "title": "...",
  "description": "...",
  "estimatedWeeks": 2-8,
  "difficulty": "beginner|intermediate|advanced",
  "sessions": [
    {
      "title": "...",
      "objective": "...",
      "keyPoints": ["...", "...", "..."],
      "practiceTask": "...",
      "durationMinutes": 45-90
    }
  ],
  "learningOutcomes": ["..."],
  "successMetrics": ["..."]
}
Create 3-5 focused sessions targeting the identified gaps.`;

  emit('thinking', `Structuring ${gaps.length} gap-targeted sessions... Calibrating difficulty to ${gapAnalysis.developmentUrgency} urgency...`);
  const module = await callAI(system, prompt, { useGroq: false, jsonMode: true });
  emit('thinking', `Learning module ready: ${module.sessions?.length || 0} sessions, ~${module.estimatedWeeks || 4} weeks`);
  return module;
}

// ── Agent 5: Career Intelligence Agent ───────────────────────────────────────
async function runCareerIntelAgent(jdAnalysis, gapAnalysis, learningModule, employeeHistory, emit) {
  emit('thinking', 'Analyzing learning patterns... Classifying Learning DNA...');
  await delay(300);

  const system = `You are a career development strategist and learning psychologist.
Generate comprehensive career intelligence profiles.
Return ONLY valid JSON.`;

  const prompt = `Generate career intelligence profile:
Role: ${jdAnalysis.roleTitle || 'Professional'}
Assessment score: ${gapAnalysis.score || 0}%
Grade: ${gapAnalysis.grade || 'C'}
Key strengths: ${(gapAnalysis.strengths || []).join(', ')}
Development areas: ${(gapAnalysis.weakAreas || []).join(', ')}
Key insight: ${gapAnalysis.keyInsight || ''}

Return:
{
  "learningDNA": "Eagle|Deep Diver|Adaptive|Sprint Learner",
  "learningDNADescription": "one sentence about this type",
  "careerReadinessScore": 0-100,
  "velocityTrend": "accelerating|steady|needs-boost",
  "topStrengths": ["strength1", "strength2", "strength3"],
  "careerInsight": "2 sentence career development insight",
  "nextMilestone": "specific career milestone to target",
  "timelineWeeks": 8-52,
  "marketDemandScore": 60-95,
  "skillsRadar": [
    { "skill": "...", "current": 0-100, "target": 0-100 }
  ]
}
Learning DNA types:
- Eagle: big-picture thinker, connects concepts quickly
- Deep Diver: detail-focused, mastery-oriented
- Adaptive: flexible, context-switching naturally
- Sprint Learner: intense focus bursts, rapid upskilling`;

  emit('thinking', 'Computing career velocity... Projecting growth trajectory...');
  const profile = await callAI(system, prompt, { useGroq: false, jsonMode: true });
  emit('thinking', `Learning DNA classified: ${profile.learningDNA || 'Adaptive'} — Career readiness: ${profile.careerReadinessScore || 70}%`);
  return profile;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main Orchestrator ─────────────────────────────────────────────────────────

export class TalentForgeOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.sessions = new Map();
  }

  async run({ sessionId, jdText, jobRole, employeeData, responses = null }) {
    const id = sessionId || randomUUID();
    this.sessions.set(id, { status: 'running', startedAt: Date.now() });

    const emit = (type, message, data = {}) => {
      const event = { sessionId: id, type, message, timestamp: new Date().toISOString(), ...data };
      this.emit('event', event);
    };

    const agentEmit = (agentId, agentName, status, message, data = {}) => {
      emit('agent_update', message, { agentId, agentName, agentStatus: status, ...data });
    };

    try {
      emit('pipeline_start', 'TalentForge Agent Swarm activated — 5 agents initializing...');
      await delay(300);

      // ── Agent 1 ──────────────────────────────────────────────────────────
      agentEmit(1, 'JD Analyzer Agent', 'running', 'Analyzing job description...');
      const jdAnalysis = await runJDAnalyzer(
        jdText,
        jobRole,
        (type, msg) => agentEmit(1, 'JD Analyzer Agent', 'running', msg)
      );
      agentEmit(1, 'JD Analyzer Agent', 'complete', `JD analyzed — ${jdAnalysis.coreSkills?.length || 0} skills extracted`, { result: jdAnalysis });
      await delay(200);

      // ── Agent 2 ──────────────────────────────────────────────────────────
      agentEmit(2, 'Assessment Agent', 'running', 'Designing personalized assessment...');
      const questions = await runAssessmentAgent(
        jdAnalysis,
        employeeData,
        (type, msg) => agentEmit(2, 'Assessment Agent', 'running', msg)
      );
      agentEmit(2, 'Assessment Agent', 'complete', `${questions.length} unique questions generated`, { result: { questions } });
      await delay(200);

      // ── Agent 3 (only if responses provided) ─────────────────────────────
      let gapAnalysis = null;
      if (responses && responses.length > 0) {
        agentEmit(3, 'Gap Analysis Agent', 'running', 'Analyzing assessment responses...');
        gapAnalysis = await runGapAnalysisAgent(
          questions,
          responses,
          jdAnalysis,
          (type, msg) => agentEmit(3, 'Gap Analysis Agent', 'running', msg)
        );
        agentEmit(3, 'Gap Analysis Agent', 'complete', `Score: ${gapAnalysis.score}% — ${gapAnalysis.weakAreas?.length || 0} gaps identified`, { result: gapAnalysis });
      } else {
        agentEmit(3, 'Gap Analysis Agent', 'pending', 'Awaiting assessment submission');
      }
      await delay(200);

      // ── Agent 4 (only if gap analysis done) ──────────────────────────────
      let learningModule = null;
      if (gapAnalysis) {
        agentEmit(4, 'Learning Path Agent', 'running', 'Designing personalized learning module...');
        learningModule = await runLearningPathAgent(
          gapAnalysis,
          jdAnalysis,
          employeeData.name,
          (type, msg) => agentEmit(4, 'Learning Path Agent', 'running', msg)
        );
        agentEmit(4, 'Learning Path Agent', 'complete', `Module ready: "${learningModule.title}"`, { result: learningModule });
        await delay(200);

        // ── Agent 5 ────────────────────────────────────────────────────────
        agentEmit(5, 'Career Intelligence Agent', 'running', 'Building career intelligence profile...');
        const careerProfile = await runCareerIntelAgent(
          jdAnalysis,
          gapAnalysis,
          learningModule,
          employeeData.history || [],
          (type, msg) => agentEmit(5, 'Career Intelligence Agent', 'running', msg)
        );
        agentEmit(5, 'Career Intelligence Agent', 'complete', `Learning DNA: ${careerProfile.learningDNA} — Career readiness: ${careerProfile.careerReadinessScore}%`, { result: careerProfile });

        this.sessions.set(id, { status: 'complete', startedAt: this.sessions.get(id).startedAt });
        emit('pipeline_complete', 'All 5 agents completed — TalentForge pipeline finished', {
          summary: {
            jdAnalysis,
            questions,
            gapAnalysis,
            learningModule,
            careerProfile,
          },
        });

        return { sessionId: id, jdAnalysis, questions, gapAnalysis, learningModule, careerProfile };
      } else {
        // Partial run (assessment generation only)
        agentEmit(4, 'Learning Path Agent', 'waiting', 'Waiting for assessment completion');
        agentEmit(5, 'Career Intelligence Agent', 'waiting', 'Waiting for gap analysis');

        this.sessions.set(id, { status: 'partial', startedAt: this.sessions.get(id).startedAt });
        emit('pipeline_partial', 'Agents 1-2 complete — Assessment ready for employee', {
          summary: { jdAnalysis, questions },
        });

        return { sessionId: id, jdAnalysis, questions };
      }
    } catch (err) {
      emit('pipeline_error', `Agent pipeline error: ${err.message}`);
      this.sessions.set(id, { status: 'error', error: err.message });
      throw err;
    }
  }

  getSession(id) {
    return this.sessions.get(id);
  }
}

export const orchestrator = new TalentForgeOrchestrator();
