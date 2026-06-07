/**
 * AgentSwarmPanel — Live TalentForge 5-Agent Activity Viewer
 *
 * Connects to SSE endpoint and streams real-time agent activity.
 * Shows which agent is running, thinking text, progress, and results.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

const BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

const AGENTS = [
  { id: 1, name: 'JD Analyzer Agent',         icon: '🔍', color: '#6366F1', role: 'Job Description Intelligence Specialist' },
  { id: 2, name: 'Assessment Agent',           icon: '📝', color: '#8B5CF6', role: 'Psychometric Assessment Designer' },
  { id: 3, name: 'Gap Analysis Agent',         icon: '📊', color: '#06B6D4', role: 'Skill Gap Intelligence Analyst' },
  { id: 4, name: 'Learning Path Agent',        icon: '🎓', color: '#10B981', role: 'Corporate Learning Experience Designer' },
  { id: 5, name: 'Career Intelligence Agent',  icon: '🚀', color: '#F59E0B', role: 'Career Development Strategist' },
];

function AgentCard({ agent, status, messages, result }) {
  const isActive  = status === 'running';
  const isDone    = status === 'complete';
  const isWaiting = status === 'waiting' || status === 'pending' || !status;
  const isError   = status === 'error';

  const borderColor = isDone   ? agent.color
                    : isActive ? agent.color
                    : isError  ? '#EF4444'
                    : 'rgba(255,255,255,0.08)';

  const bgColor = isDone   ? `${agent.color}18`
                : isActive ? `${agent.color}12`
                : 'transparent';

  return (
    <div
      style={{
        border: `1.5px solid ${borderColor}`,
        background: bgColor,
        borderRadius: 12,
        padding: '14px 16px',
        transition: 'all 0.4s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Active glow */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 12,
          boxShadow: `0 0 20px ${agent.color}30`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Agent number badge */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: isDone || isActive ? agent.color : 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          transition: 'background 0.3s',
        }}>
          {isDone ? '✓' : agent.id}
        </div>

        {/* Agent info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15 }}>{agent.icon}</span>
            <span style={{
              fontSize: 13, fontWeight: 600, color: isDone || isActive ? '#F1F5F9' : '#64748B',
            }}>
              {agent.name}
            </span>
            {isActive && <PulsingDot color={agent.color} />}
            {isDone && <span style={{ fontSize: 10, color: agent.color, fontWeight: 600, marginLeft: 2 }}>COMPLETE</span>}
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{agent.role}</div>
        </div>

        {/* Status icon */}
        <div style={{ fontSize: 14 }}>
          {isActive ? <SpinnerIcon color={agent.color} /> : isDone ? '✅' : isError ? '❌' : '⏳'}
        </div>
      </div>

      {/* Thinking stream */}
      {(isActive || isDone) && messages?.length > 0 && (
        <div style={{
          marginTop: 10, padding: '8px 10px',
          background: 'rgba(0,0,0,0.25)', borderRadius: 8,
          fontSize: 11, color: '#94A3B8', lineHeight: 1.5,
          maxHeight: 60, overflowY: 'auto',
        }}>
          {messages.slice(-3).map((m, i) => (
            <div key={i} style={{ color: i === messages.length - 1 ? '#CBD5E1' : '#64748B' }}>
              {i === messages.length - 1 ? '▶ ' : '  '}{m}
            </div>
          ))}
        </div>
      )}

      {/* Result summary */}
      {isDone && result && (
        <ResultSummary agentId={agent.id} result={result} color={agent.color} />
      )}
    </div>
  );
}

function ResultSummary({ agentId, result, color }) {
  let content = null;

  if (agentId === 1 && result) {
    content = `${result.coreSkills?.length || 0} skills · ${result.seniorityLevel || 'mid'} level · ${result.industryDomain || 'Technology'}`;
  } else if (agentId === 2 && result?.questions) {
    content = `${result.questions.length} personalized questions generated`;
  } else if (agentId === 3 && result) {
    content = `Score: ${result.score}% (${result.grade}) · ${result.weakAreas?.length || 0} gaps identified`;
  } else if (agentId === 4 && result) {
    content = `"${result.title}" · ${result.sessions?.length || 0} sessions · ~${result.estimatedWeeks || 4}w`;
  } else if (agentId === 5 && result) {
    content = `${result.learningDNA} · Career readiness: ${result.careerReadinessScore}%`;
  }

  if (!content) return null;

  return (
    <div style={{
      marginTop: 8, padding: '5px 8px',
      background: `${color}15`, borderRadius: 6,
      fontSize: 11, color, fontWeight: 500,
    }}>
      {content}
    </div>
  );
}

function PulsingDot({ color }) {
  return (
    <div style={{ position: 'relative', width: 8, height: 8 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: color, animation: 'pulse-ring 1.4s ease-out infinite',
      }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, margin: 1 }} />
      <style>{`@keyframes pulse-ring { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.5);opacity:0} }`}</style>
    </div>
  );
}

function SpinnerIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────

export default function AgentSwarmPanel({ sessionId, onComplete, compact = false }) {
  const [agentStates, setAgentStates] = useState({});
  const [pipelineStatus, setPipelineStatus] = useState('idle'); // idle | running | complete | error
  const [statusMessage, setStatusMessage] = useState('');
  const [finalResult, setFinalResult] = useState(null);
  const esRef = useRef(null);

  const connect = useCallback((sid) => {
    if (esRef.current) esRef.current.close();

    const es = new EventSource(`${BASE_URL}/api/talentforge/stream/${sid}`);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        handleEvent(event);
      } catch (_) {}
    };

    es.onerror = () => {
      setPipelineStatus(s => s === 'running' ? 'error' : s);
    };
  }, []);

  const handleEvent = useCallback((event) => {
    const { type, agentId, agentName, agentStatus, message, result } = event;

    if (type === 'connected') return;

    if (type === 'pipeline_start') {
      setPipelineStatus('running');
      setStatusMessage(message);
      return;
    }

    if (type === 'pipeline_complete' || type === 'pipeline_partial') {
      setPipelineStatus('complete');
      setStatusMessage(message);
      if (event.summary) {
        setFinalResult(event.summary);
        onComplete?.(event.summary);
      }
      return;
    }

    if (type === 'pipeline_error') {
      setPipelineStatus('error');
      setStatusMessage(message);
      return;
    }

    if (type === 'agent_update' && agentId) {
      setAgentStates(prev => {
        const cur = prev[agentId] || { status: 'waiting', messages: [], result: null };
        return {
          ...prev,
          [agentId]: {
            status: agentStatus || cur.status,
            messages: message ? [...(cur.messages || []), message] : cur.messages,
            result: result !== undefined ? result : cur.result,
          },
        };
      });
    }
  }, [onComplete]);

  useEffect(() => {
    if (sessionId) {
      setPipelineStatus('running');
      setAgentStates({});
      setFinalResult(null);
      connect(sessionId);
    }
    return () => esRef.current?.close();
  }, [sessionId, connect]);

  const completedCount = Object.values(agentStates).filter(s => s.status === 'complete').length;
  const progress = (completedCount / 5) * 100;

  if (!sessionId) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 16,
      padding: compact ? 16 : 24,
      color: '#F1F5F9',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: compact ? 14 : 16, fontWeight: 700, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🤖</span>
            <span>TalentForge Agent Swarm</span>
            {pipelineStatus === 'running' && (
              <span style={{ fontSize: 10, background: '#6366F1', color: '#fff', borderRadius: 20, padding: '2px 8px' }}>LIVE</span>
            )}
            {pipelineStatus === 'complete' && (
              <span style={{ fontSize: 10, background: '#10B981', color: '#fff', borderRadius: 20, padding: '2px 8px' }}>COMPLETE</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>5 specialized agents · Powered by Gemini & Groq</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>{completedCount}/5</div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: pipelineStatus === 'error' ? '#EF4444' : 'linear-gradient(90deg, #6366F1, #10B981)',
          width: `${pipelineStatus === 'error' ? 100 : progress}%`,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Status message */}
      {statusMessage && (
        <div style={{
          fontSize: 11, color: '#94A3B8', marginBottom: 14,
          padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6,
        }}>
          {pipelineStatus === 'running' ? '⚡ ' : pipelineStatus === 'complete' ? '✅ ' : '❌ '}{statusMessage}
        </div>
      )}

      {/* Agent cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {AGENTS.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            status={agentStates[agent.id]?.status}
            messages={agentStates[agent.id]?.messages}
            result={agentStates[agent.id]?.result}
          />
        ))}
      </div>

      {/* Final result summary */}
      {pipelineStatus === 'complete' && finalResult && (
        <div style={{
          marginTop: 16, padding: '12px 14px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))',
          border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10,
          fontSize: 12, color: '#CBD5E1',
        }}>
          <div style={{ fontWeight: 700, color: '#F1F5F9', marginBottom: 6 }}>🎯 Pipeline Complete</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {finalResult.gapAnalysis && (
              <>
                <span style={{ color: '#64748B' }}>Assessment Score</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>{finalResult.gapAnalysis.score}% ({finalResult.gapAnalysis.grade})</span>
              </>
            )}
            {finalResult.careerProfile && (
              <>
                <span style={{ color: '#64748B' }}>Learning DNA</span>
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>{finalResult.careerProfile.learningDNA}</span>
                <span style={{ color: '#64748B' }}>Career Readiness</span>
                <span style={{ color: '#6366F1', fontWeight: 600 }}>{finalResult.careerProfile.careerReadinessScore}%</span>
              </>
            )}
            {finalResult.learningModule && (
              <>
                <span style={{ color: '#64748B' }}>Module Ready</span>
                <span style={{ color: '#CBD5E1' }}>{finalResult.learningModule.sessions?.length || 0} sessions</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * DemoLauncher — self-contained demo trigger for judges/landing page
 */
export function AgentSwarmDemo() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const startDemo = async () => {
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(`${BASE_URL}/api/talentforge/demo`);
      const d = await r.json();
      if (d.sessionId) setSessionId(d.sessionId);
    } catch (e) {
      console.error('Demo start failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {!sessionId ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <h2 style={{ color: '#F1F5F9', marginBottom: 8 }}>TalentForge Agent Swarm</h2>
          <p style={{ color: '#64748B', marginBottom: 24, fontSize: 14 }}>
            Watch 5 AI agents collaborate in real-time to transform a job description into a complete employee development plan.
          </p>
          <button
            onClick={startDemo}
            disabled={loading}
            style={{
              padding: '12px 32px', borderRadius: 8,
              background: loading ? '#374151' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600,
            }}
          >
            {loading ? 'Starting...' : '▶ Launch Demo Pipeline'}
          </button>
        </div>
      ) : (
        <AgentSwarmPanel sessionId={sessionId} onComplete={setResult} />
      )}
    </div>
  );
}
