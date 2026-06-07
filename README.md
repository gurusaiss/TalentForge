# TalentForge — Enterprise Talent Intelligence via Agent Swarms

> **Microsoft Build AI Hackathon 2026 · Theme 5: Agent Swarms**
>
> Five AI agents. One job description. Complete employee development — automated end to end.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-F26522)](https://console.groq.com)

---

## The Problem

Enterprise L&D is broken. Companies spend **$350 billion annually** on employee training, yet 70% of content is forgotten within 24 hours. HR teams spend 40% of their time on manual training administration. Every employee gets the same generic course — regardless of their actual skill gaps, job role, or career trajectory.

No existing LMS can take a job description and automatically generate a complete, personalized development journey.

---

## Our Solution

TalentForge deploys a swarm of **5 specialized AI agents** that activate the moment a job description is uploaded. Each agent is a domain expert that passes enriched intelligence to the next — producing a fully personalized assessment, skill gap map, learning module, and career profile for every employee. Zero manual HR effort.

```
JD Upload ──► Agent 1 ──► Agent 2 ──► Agent 3 ──► Agent 4 ──► Agent 5
              Analyze      Assess      Gap Map     Learn Path   Career Intel
              (Groq)       (Gemini)    (Groq)      (Gemini)     (Gemini)
```

A **Human-in-the-Loop approval gate** ensures admin review before any content reaches employees — responsible AI with full human oversight.

A **Live Agent Activity Panel** streams each agent's thinking to the UI in real-time via SSE — judges see the swarm working.

---

## The 5-Agent Architecture

| # | Agent | LLM | Output |
|---|-------|-----|--------|
| 1 | **JD Analyzer Agent** — extracts competency framework | Groq LLaMA 3.3 70B | Skill map, seniority, domain |
| 2 | **Assessment Agent** — designs personalized MCQ test | Gemini 2.0 Flash | 10 unique, role-calibrated questions |
| 3 | **Gap Analysis Agent** — scores and maps deficits | Groq LLaMA 3.3 70B | Prioritized gap report + grade |
| 4 | **Learning Path Agent** — creates targeted module | Gemini 2.0 Flash | Full learning module with sessions |
| 5 | **Career Intelligence Agent** — builds career profile | Gemini 2.0 Flash | Learning DNA + career trajectory |

---

## Platform Features

- **Multi-tenant architecture** — Super Admin manages unlimited enterprise tenants, complete data isolation
- **Date-gated assessments** — employees cannot see assessments until the designated date
- **Deadline enforcement** — assessments lock automatically after the deadline
- **CareerTwin profiles** — AI-generated Learning DNA (Eagle / Deep Diver / Adaptive / Sprint Learner)
- **Learning Velocity charts** — score progression over time (Recharts LineChart)
- **Skills Radar chart** — visual competency gap visualization
- **Reports dashboard** — filter by role, date, module, grade; per-employee breakdown with grade badges
- **Approval workflow** — AI-generated modules queued for admin review before employee deployment
- **Real-time Agent Panel** — SSE streaming shows 5 agents working live in the browser

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js 20, Express.js |
| Agent Orchestration | Custom pipeline, EventEmitter + SSE streaming |
| Primary LLM | Google Gemini 2.0 Flash |
| Speed LLM | Groq LLaMA 3.3 70B (fast reasoning, agent chains) |
| Database | Supabase PostgreSQL + file-based fallback |
| Auth | JWT (jsonwebtoken) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Free Gemini API key: [aistudio.google.com](https://aistudio.google.com) → Get API Key
- Free Groq API key: [console.groq.com](https://console.groq.com) → Sign Up

### 1. Clone
```bash
git clone https://github.com/gurusaiss/TalentForge.git
cd TalentForge
```

### 2. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Environment variables

Create `.env` in the project root:
```env
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
JWT_SECRET=any_random_secret_string
GEMINI_MODEL=gemini-2.0-flash

# Optional Supabase (falls back to local files if not set)
SUPABASE_URL=your_supabase_url
SUPABASESERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run
```bash
# Terminal 1 — Backend (port 3001)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev
```

### 5. Access
- **App**: http://localhost:5173
- **Agent Swarm Demo** (no login needed): http://localhost:5173/agent-swarm

### Demo credentials

| Role | Name | Email | Password | Access |
|------|------|-------|----------|--------|
| **Super Admin** | Super Admin | superadmin@talentforge.ai | Admin@123 | Full platform — all companies, all users, billing, settings |
| **Company Admin** | Sarah Johnson | admin@demo.com | Admin@123 | Acme Corp — assessments, modules, employees, reports |
| **Employee 1** | Alex Chen | alex@demo.com | Employee@123 | Software Engineer — has assessment + learning path + CareerTwin |
| **Employee 2** | Priya Sharma | priya@demo.com | Employee@123 | Product Manager — has assessment + learning path + CareerTwin |
| **Employee 3** | James Okafor | james@demo.com | Employee@123 | Data Analyst — assigned modules, no assessment yet |

> **Agent Swarm Demo** — no login needed: `/agent-swarm`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│            React Frontend  (Vercel)                      │
│  Landing · Admin Dashboard · Employee Portal · Reports   │
│  AgentSwarmPanel (SSE live) · CareerTwin · Radar Chart  │
└────────────────────┬────────────────────────────────────┘
                     │  REST + SSE
┌────────────────────▼────────────────────────────────────┐
│          Node.js / Express  (Render)                     │
│                                                          │
│  TalentForgeOrchestrator (EventEmitter)                  │
│  ├── Agent 1: JD Analyzer      → Groq LLaMA 3.3         │
│  ├── Agent 2: Assessment       → Gemini 2.0 Flash        │
│  ├── Agent 3: Gap Analysis     → Groq LLaMA 3.3         │
│  ├── Agent 4: Learning Path    → Gemini 2.0 Flash        │
│  └── Agent 5: Career Intel     → Gemini 2.0 Flash        │
│                                                          │
│  SSE Event Bus (/api/talentforge/stream/:sessionId)      │
│  REST Routes: assessments · modules · users · auth       │
│               superadmin · org · notifications           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│       Supabase PostgreSQL  +  File-based fallback        │
└─────────────────────────────────────────────────────────┘
```

---

## AI Tools Used in Product

| Tool | Purpose |
|------|---------|
| **Google Gemini 2.0 Flash** | Assessment generation, learning module creation, career intelligence |
| **Groq LLaMA 3.3 70B** | JD analysis, gap analysis — 10x faster inference for live demo responsiveness |

---

## AI Tools Used in Development

| Tool | Purpose |
|------|---------|
| **Claude (Anthropic)** | Architecture design, agent orchestration, code generation |
| **GitHub Copilot** | Code completion |

> **Note on Microsoft Stack:** Per admin Mohammed Aftab's confirmation in the HackerEarth discussion tab, Microsoft Azure is not mandatory as Microsoft did not provide free credits. Free-tier alternatives are explicitly permitted.

---

## Team

| Name | Role |
|------|------|
| Guru Sai Sumith | Full-stack development, AI/agent architecture, system design |

---

## Open Source Credits

| Library | License |
|---------|---------|
| [React](https://react.dev) | MIT |
| [Vite](https://vitejs.dev) | MIT |
| [Tailwind CSS](https://tailwindcss.com) | MIT |
| [Recharts](https://recharts.org) | MIT |
| [Express.js](https://expressjs.com) | MIT |
| [Socket.io](https://socket.io) | MIT |
| [Supabase JS](https://supabase.com) | MIT |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | MIT |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | BSD-2 |
| [pdf-parse](https://github.com/modesty/pdf-parse) | MIT |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | MIT |
| [multer](https://github.com/expressjs/multer) | MIT |
| [cors](https://github.com/expressjs/cors) | MIT |

---

*TalentForge — Microsoft Build AI Hackathon 2026 — Theme 5: Agent Swarms*
