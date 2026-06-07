/**
 * AgentSwarmDemoPage — Public demo page for TalentForge Agent Swarm
 * Accessible at /agent-swarm — no login required (for judges)
 */

import React, { useState } from 'react';
import { AgentSwarmDemo } from '../components/AgentSwarmPanel.jsx';

export default function AgentSwarmDemoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 20,
          fontSize: 12, color: '#818CF8',
        }}>
          <span>🏆</span> Microsoft Build AI Hackathon 2026 — Theme 5: Agent Swarms
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#F1F5F9',
          marginBottom: 12, letterSpacing: '-0.02em',
        }}>
          TalentForge
          <span style={{ color: '#6366F1' }}> Agent Swarm</span>
        </h1>

        <p style={{ fontSize: 16, color: '#64748B', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Five specialized AI agents collaborate in real-time to transform any job description into a
          personalized assessment, skill gap analysis, learning module, and career profile — end to end, automated.
        </p>

        {/* Architecture badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {[
            { label: 'Custom Agent Orchestration', color: '#6366F1' },
            { label: 'Google Gemini', color: '#10B981' },
            { label: 'Groq LLaMA 3.3', color: '#F59E0B' },
            { label: 'SSE Live Stream', color: '#06B6D4' },
            { label: '5-Agent Swarm', color: '#8B5CF6' },
          ].map(b => (
            <span key={b.label} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: `${b.color}20`, border: `1px solid ${b.color}50`, color: b.color,
            }}>{b.label}</span>
          ))}
        </div>
      </div>

      {/* Agent Flow Diagram */}
      <div style={{ maxWidth: 800, margin: '0 auto 32px', padding: '20px 24px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
        <div style={{ fontSize: 11, color: '#475569', textAlign: 'center', marginBottom: 12 }}>AGENT PIPELINE</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
          {[
            { id: 1, name: 'JD Analyzer', icon: '🔍', color: '#6366F1' },
            { id: 2, name: 'Assessment', icon: '📝', color: '#8B5CF6' },
            { id: 3, name: 'Gap Analysis', icon: '📊', color: '#06B6D4' },
            { id: 4, name: 'Learning Path', icon: '🎓', color: '#10B981' },
            { id: 5, name: 'Career Intel', icon: '🚀', color: '#F59E0B' },
          ].map((agent, i, arr) => (
            <React.Fragment key={agent.id}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', margin: '0 auto 4px',
                  background: `${agent.color}20`, border: `1.5px solid ${agent.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>{agent.icon}</div>
                <div style={{ fontSize: 9, color: '#64748B', maxWidth: 60 }}>{agent.name}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ color: '#334155', fontSize: 18, marginBottom: 16 }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: '#475569' }}>
          Each agent passes enriched intelligence to the next → complete talent development in &lt;60 seconds
        </div>
      </div>

      {/* Demo Panel */}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <AgentSwarmDemo />
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 48, color: '#334155', fontSize: 12 }}>
        Built for Microsoft Build AI Hackathon 2026 · Theme 5: Agent Swarms
        <br />
        <span style={{ color: '#475569' }}>React + Node.js + Gemini + Groq · Deployed on Vercel + Render</span>
      </div>
    </div>
  );
}
