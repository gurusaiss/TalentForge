/**
 * seed-demo-data.js — TalentForge Hackathon Demo Seeder
 *
 * Creates:
 *   - 1 Super Admin account
 *   - 1 Company Admin account
 *   - 3 Demo employees with full JDs and job roles
 *   - 2 Pre-completed assessments with scores and gap analysis
 *   - 2 Pre-generated learning modules (approved, ready in dashboard)
 *   - 3 Fake company tenants in superadmin view
 *   - CareerTwin data for both assessed employees
 *
 * Run: node seed-demo-data.js
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, 'data');

if (!existsSync(DATA)) mkdirSync(DATA, { recursive: true });

const write = (file, data) => writeFileSync(join(DATA, file), JSON.stringify(data, null, 2));
const read  = (file, def) => {
  try { return JSON.parse(readFileSync(join(DATA, file), 'utf-8')); }
  catch { return def; }
};

// ── Passwords ─────────────────────────────────────────────────────────────────
const PASS = 'Admin@123';
const EMP_PASS = 'Employee@123';
const hash = (p) => bcrypt.hashSync(p, 10);

// ── IDs ───────────────────────────────────────────────────────────────────────
const SUPER_ID    = 'auth_user_001';
const ADMIN_ID    = 'auth_user_002';
const EMP1_ID     = 'auth_user_003';
const EMP2_ID     = 'auth_user_004';
const EMP3_ID     = 'auth_user_005';
const COMPANY_ID  = 'company_demo_01';

const ASSESS1_ID  = randomUUID();
const ASSESS2_ID  = randomUUID();
const MODULE1_ID  = randomUUID();
const MODULE2_ID  = randomUUID();

// ── Job Descriptions ──────────────────────────────────────────────────────────
const JD_SWE = `Software Engineer — Full Stack
We are building the next generation of enterprise software and need a skilled Full Stack Software Engineer.

Responsibilities:
• Design and develop scalable web applications using React and Node.js
• Build and maintain RESTful APIs and microservices architecture
• Implement CI/CD pipelines and DevOps best practices
• Collaborate with product and design teams on feature development
• Conduct code reviews and mentor junior developers
• Optimize application performance and ensure reliability

Requirements:
• 3+ years of experience with React, TypeScript, and Node.js
• Strong understanding of cloud architecture (AWS/GCP/Azure)
• Experience with Docker, Kubernetes, and container orchestration
• Proficiency in SQL (PostgreSQL) and NoSQL databases (MongoDB, Redis)
• Knowledge of system design and distributed systems patterns
• Experience with Git, GitHub Actions, and agile methodologies`;

const JD_PM = `Product Manager — Enterprise SaaS
We are looking for a strategic Product Manager to drive product vision and roadmap.

Responsibilities:
• Define product vision, strategy, and roadmap aligned with business goals
• Gather and prioritize product and customer requirements
• Work with engineering, design, and marketing to ship features
• Analyze product metrics and make data-driven decisions
• Conduct user interviews, competitive analysis, and market research
• Write clear PRDs, user stories, and acceptance criteria

Requirements:
• 4+ years of product management experience in B2B/SaaS
• Strong analytical skills with experience in SQL and data tools
• Experience with Agile/Scrum methodologies
• Excellent communication and stakeholder management skills
• Understanding of UX principles and working with design teams
• Familiarity with product analytics tools (Mixpanel, Amplitude, Heap)`;

const JD_DA = `Data Analyst — Business Intelligence
Join our data team to transform raw data into actionable business insights.

Responsibilities:
• Analyze large datasets to identify trends and business opportunities
• Build and maintain dashboards and reports using BI tools
• Write complex SQL queries for data extraction and transformation
• Collaborate with business stakeholders to understand analytics needs
• Support A/B testing and experimentation programs
• Ensure data quality and integrity across pipelines

Requirements:
• 2+ years in data analysis or business intelligence
• Expert-level SQL (window functions, CTEs, complex joins)
• Experience with BI tools (Tableau, Power BI, Looker, or Metabase)
• Python or R for data analysis and visualization
• Understanding of statistical methods and A/B testing
• Experience with data warehouses (BigQuery, Redshift, Snowflake)`;

// ── Users ─────────────────────────────────────────────────────────────────────
const users = {
  nextUserId: 6,
  users: [
    {
      userId: SUPER_ID,
      email: 'superadmin@talentforge.ai',
      passwordHash: hash(PASS),
      name: 'Super Admin',
      role: 'superadmin',
      learningUUID: randomUUID(),
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobRole: 'Platform Administrator',
      department: 'Platform',
      companyId: 'platform',
      companyName: 'TalentForge Platform',
      onboardingComplete: true,
    },
    {
      userId: ADMIN_ID,
      email: 'admin@demo.com',
      passwordHash: hash(PASS),
      name: 'Sarah Johnson',
      role: 'admin',
      learningUUID: randomUUID(),
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobRole: 'HR Administrator',
      department: 'Human Resources',
      companyId: COMPANY_ID,
      companyName: 'Acme Corp',
      onboardingComplete: true,
    },
    {
      userId: EMP1_ID,
      email: 'alex@demo.com',
      passwordHash: hash(EMP_PASS),
      name: 'Alex Chen',
      role: 'employee',
      learningUUID: randomUUID(),
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobRole: 'Software Engineer',
      department: 'Engineering',
      jobDescription: JD_SWE,
      managerId: ADMIN_ID,
      companyId: COMPANY_ID,
      companyName: 'Acme Corp',
      onboardingComplete: true,
    },
    {
      userId: EMP2_ID,
      email: 'priya@demo.com',
      passwordHash: hash(EMP_PASS),
      name: 'Priya Sharma',
      role: 'employee',
      learningUUID: randomUUID(),
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobRole: 'Product Manager',
      department: 'Product',
      jobDescription: JD_PM,
      managerId: ADMIN_ID,
      companyId: COMPANY_ID,
      companyName: 'Acme Corp',
      onboardingComplete: true,
    },
    {
      userId: EMP3_ID,
      email: 'james@demo.com',
      passwordHash: hash(EMP_PASS),
      name: 'James Okafor',
      role: 'employee',
      learningUUID: randomUUID(),
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobRole: 'Data Analyst',
      department: 'Analytics',
      jobDescription: JD_DA,
      managerId: ADMIN_ID,
      companyId: COMPANY_ID,
      companyName: 'Acme Corp',
      onboardingComplete: true,
    },
  ],
};

// ── Assessments ───────────────────────────────────────────────────────────────
const SWE_QUESTIONS = [
  { type: 'mcq', question: 'Which pattern best describes the role of an API Gateway in microservices?', options: ['A) It acts as a single entry point that routes requests, handles auth, and aggregates responses', 'B) It stores shared configuration for all microservices', 'C) It replaces the need for a message queue', 'D) It acts as a database connection pool'], answer: 'A', difficulty: 'medium', skillArea: 'System Design', explanation: 'API Gateway is the front door for all clients in microservices architecture.' },
  { type: 'mcq', question: 'In a React application, when should you use useCallback vs useMemo?', options: ['A) useCallback for memoizing functions, useMemo for memoizing computed values', 'B) They are interchangeable — use either', 'C) useMemo for functions, useCallback for values', 'D) useCallback is only for class components'], answer: 'A', difficulty: 'medium', skillArea: 'React', explanation: 'useCallback prevents function recreation; useMemo prevents expensive recalculations.' },
  { type: 'mcq', question: 'Which CI/CD strategy allows deploying to a subset of users before full rollout?', options: ['A) Blue-Green Deployment', 'B) Canary Deployment', 'C) Rolling Deployment', 'D) Feature Flags only'], answer: 'B', difficulty: 'medium', skillArea: 'CI/CD', explanation: 'Canary deployment routes a small percentage of traffic to the new version first.' },
  { type: 'mcq', question: 'What is the primary advantage of a read replica in PostgreSQL?', options: ['A) It speeds up write operations', 'B) It provides a backup copy for disaster recovery only', 'C) It offloads read queries to reduce load on the primary database', 'D) It automatically shards data across multiple nodes'], answer: 'C', difficulty: 'medium', skillArea: 'Databases', explanation: 'Read replicas handle SELECT queries, freeing the primary for writes.' },
  { type: 'mcq', question: 'In Kubernetes, what is the difference between a Deployment and a StatefulSet?', options: ['A) Deployments are for stateless apps; StatefulSets maintain stable identity and storage for stateful apps', 'B) StatefulSets run faster than Deployments', 'C) Deployments cannot be scaled; StatefulSets can', 'D) There is no practical difference'], answer: 'A', difficulty: 'hard', skillArea: 'Cloud Architecture', explanation: 'StatefulSets give pods stable network identity and persistent storage — needed for databases.' },
  { type: 'mcq', question: 'What does the CAP theorem state about distributed systems?', options: ['A) You can always achieve Consistency, Availability, and Partition tolerance simultaneously', 'B) A distributed system can only guarantee two of the three: Consistency, Availability, Partition tolerance', 'C) Partition tolerance is optional in cloud-native systems', 'D) CAP only applies to SQL databases'], answer: 'B', difficulty: 'hard', skillArea: 'System Design', explanation: 'CAP theorem: choose 2 of 3. Most distributed databases choose AP or CP.' },
  { type: 'mcq', question: 'Which Docker command creates a new image from a running container\'s current state?', options: ['A) docker save', 'B) docker export', 'C) docker commit', 'D) docker snapshot'], answer: 'C', difficulty: 'easy', skillArea: 'CI/CD', explanation: 'docker commit creates a new image from a container\'s changes.' },
  { type: 'mcq', question: 'What is the purpose of an index in a relational database?', options: ['A) To enforce uniqueness constraints only', 'B) To speed up data retrieval at the cost of additional storage and slower writes', 'C) To compress table data for storage efficiency', 'D) To automatically partition large tables'], answer: 'B', difficulty: 'easy', skillArea: 'Databases', explanation: 'Indexes trade storage and write performance for faster reads.' },
  { type: 'mcq', question: 'In Node.js, what is the event loop and why does it matter?', options: ['A) A for-loop construct unique to Node.js', 'B) The mechanism that allows Node.js to perform non-blocking I/O by offloading operations to the OS', 'C) A library for managing async operations', 'D) A built-in HTTP server'], answer: 'B', difficulty: 'medium', skillArea: 'Node.js', explanation: 'The event loop is what makes Node.js non-blocking and highly concurrent.' },
  { type: 'mcq', question: 'Which cloud architecture pattern separates read and write operations into different models?', options: ['A) Event Sourcing', 'B) Saga Pattern', 'C) CQRS (Command Query Responsibility Segregation)', 'D) Circuit Breaker'], answer: 'C', difficulty: 'hard', skillArea: 'Cloud Architecture', explanation: 'CQRS uses separate read/write models enabling independent optimization of each.' },
];

const SWE_RESPONSES = [
  { answer: 'A' }, { answer: 'A' }, { answer: 'A' }, { answer: 'C' }, { answer: 'A' },
  { answer: 'B' }, { answer: 'C' }, { answer: 'B' }, { answer: 'B' }, { answer: 'B' },
];

const PM_QUESTIONS = [
  { type: 'mcq', question: 'Which metric best measures product-market fit?', options: ['A) Monthly Active Users', 'B) Sean Ellis\'s "How disappointed would you be if this product disappeared?" survey — 40%+ very disappointed', 'C) App Store rating above 4.5', 'D) Revenue growth above 10% MoM'], answer: 'B', difficulty: 'medium', skillArea: 'Product Strategy', explanation: '40% very disappointed threshold is the canonical PMF signal.' },
  { type: 'mcq', question: 'In a user story, what does "Acceptance Criteria" define?', options: ['A) The technical implementation approach', 'B) The conditions that must be met for the story to be considered complete', 'C) The business justification for building the feature', 'D) The design specifications'], answer: 'B', difficulty: 'easy', skillArea: 'Agile/Scrum', explanation: 'Acceptance criteria define what done looks like — testable conditions for story completion.' },
  { type: 'mcq', question: 'What is the RICE prioritization framework?', options: ['A) Revenue, Impact, Cost, Effort', 'B) Reach, Impact, Confidence, Effort — used to score features', 'C) Risk, Innovation, Cost, Estimation', 'D) Roadmap, Ideas, Clarity, Execution'], answer: 'B', difficulty: 'medium', skillArea: 'Prioritization', explanation: 'RICE = (Reach × Impact × Confidence) / Effort. Higher score = higher priority.' },
  { type: 'mcq', question: 'What is a North Star Metric?', options: ['A) The metric that tracks quarterly revenue', 'B) A single metric that best captures the core value your product delivers to customers', 'C) The metric used in investor presentations', 'D) The metric for tracking team velocity'], answer: 'B', difficulty: 'medium', skillArea: 'Product Strategy', explanation: 'North Star Metric aligns the entire team around one core value-delivery signal.' },
  { type: 'mcq', question: 'In an A/B test, what is statistical significance?', options: ['A) The test ran long enough to have many users', 'B) The probability that the observed difference is not due to random chance, typically p < 0.05', 'C) Variant B always outperforms Variant A', 'D) The test has been approved by stakeholders'], answer: 'B', difficulty: 'hard', skillArea: 'Data Analysis', explanation: 'p < 0.05 means less than 5% chance the result is random — the standard for significance.' },
  { type: 'mcq', question: 'What distinguishes a Product Roadmap from a Feature Backlog?', options: ['A) The roadmap is the same as the backlog but sorted by priority', 'B) The roadmap communicates strategic direction and outcomes; the backlog is a detailed list of work items', 'C) Roadmaps are only for external stakeholders', 'D) Backlogs only contain bug fixes'], answer: 'B', difficulty: 'medium', skillArea: 'Product Strategy', explanation: 'Roadmap = vision & strategy. Backlog = tactical execution list.' },
  { type: 'mcq', question: 'What is the Jobs-to-be-Done (JTBD) framework?', options: ['A) A hiring framework for product teams', 'B) A framework that focuses on the underlying goal a customer is trying to achieve, not the product features', 'C) A framework for writing user stories', 'D) A project management methodology'], answer: 'B', difficulty: 'medium', skillArea: 'User Research', explanation: 'JTBD: customers don\'t buy products, they "hire" them to do a job.' },
  { type: 'mcq', question: 'Which is the most appropriate way to validate a product hypothesis before building?', options: ['A) Build the full feature and measure adoption', 'B) Create a lightweight prototype or landing page and measure real user behavior', 'C) Ask the engineering team if it is feasible', 'D) Survey existing customers about feature desirability'], answer: 'B', difficulty: 'medium', skillArea: 'User Research', explanation: 'Build the minimum needed to test the hypothesis — reduce waste, validate fast.' },
  { type: 'mcq', question: 'What does "retention" measure in a SaaS product?', options: ['A) How many new users signed up', 'B) The percentage of users who continue using the product over a given time period', 'C) Revenue generated per user', 'D) How often users contact support'], answer: 'B', difficulty: 'easy', skillArea: 'Data Analysis', explanation: 'Retention is the % of users who come back — the most important SaaS health metric.' },
  { type: 'mcq', question: 'In Scrum, what is the purpose of a Sprint Retrospective?', options: ['A) To plan the next sprint backlog', 'B) To demo completed work to stakeholders', 'C) For the team to inspect itself and create a plan for improvement', 'D) To estimate story points for upcoming work'], answer: 'C', difficulty: 'easy', skillArea: 'Agile/Scrum', explanation: 'Retros are about team process improvement — what went well, what to change.' },
];

const PM_RESPONSES = [
  { answer: 'B' }, { answer: 'B' }, { answer: 'A' }, { answer: 'B' }, { answer: 'A' },
  { answer: 'B' }, { answer: 'B' }, { answer: 'B' }, { answer: 'B' }, { answer: 'C' },
];

function scoreQuestions(questions, responses) {
  let correct = 0;
  const breakdown = questions.map((q, i) => {
    const userAns = (responses[i]?.answer || '').trim().toUpperCase().charAt(0);
    const correctAns = (q.answer || '').trim().toUpperCase().charAt(0);
    const isCorrect = userAns === correctAns;
    if (isCorrect) correct++;
    return { question: q.question, skillArea: q.skillArea, isCorrect, userAnswer: responses[i]?.answer, correctAnswer: q.answer };
  });
  const score = Math.round((correct / questions.length) * 100);
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  const skillMap = {};
  breakdown.forEach(b => {
    if (!skillMap[b.skillArea]) skillMap[b.skillArea] = { correct: 0, total: 0 };
    skillMap[b.skillArea].total++;
    if (b.isCorrect) skillMap[b.skillArea].correct++;
  });
  const weakAreas = Object.entries(skillMap).filter(([, v]) => v.correct / v.total < 0.7).map(([k]) => k);
  const strengths = Object.entries(skillMap).filter(([, v]) => v.correct / v.total >= 0.7).map(([k]) => k);
  return { score, grade, correct, total: questions.length, breakdown, skillAreas: skillMap, weakAreas, strengths };
}

const sweScoring = scoreQuestions(SWE_QUESTIONS, SWE_RESPONSES);
const pmScoring  = scoreQuestions(PM_QUESTIONS,  PM_RESPONSES);

const NOW = new Date();
const PAST_DATE = new Date(NOW - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days ago

const assessments = [
  {
    id: ASSESS1_ID,
    title: 'Software Engineer Technical Assessment',
    targetUsers: [EMP1_ID],
    employeeAssignments: [{
      userId: EMP1_ID,
      userName: 'Alex Chen',
      userEmail: 'alex@demo.com',
      jobRole: 'Software Engineer',
      questions: SWE_QUESTIONS,
      status: 'submitted',
      assignedAt: PAST_DATE,
      startedAt: PAST_DATE,
      submittedAt: PAST_DATE,
      responses: SWE_RESPONSES,
      scoring: sweScoring,
    }],
    questionCount: 10,
    questionTypes: ['mcq'],
    assessmentDate: PAST_DATE,
    deadline: null,
    duration: 30,
    createdBy: ADMIN_ID,
    createdAt: PAST_DATE,
    updatedAt: PAST_DATE,
    isActive: true,
  },
  {
    id: ASSESS2_ID,
    title: 'Product Manager Skills Assessment',
    targetUsers: [EMP2_ID],
    employeeAssignments: [{
      userId: EMP2_ID,
      userName: 'Priya Sharma',
      userEmail: 'priya@demo.com',
      jobRole: 'Product Manager',
      questions: PM_QUESTIONS,
      status: 'submitted',
      assignedAt: PAST_DATE,
      startedAt: PAST_DATE,
      submittedAt: PAST_DATE,
      responses: PM_RESPONSES,
      scoring: pmScoring,
    }],
    questionCount: 10,
    questionTypes: ['mcq'],
    assessmentDate: PAST_DATE,
    deadline: null,
    duration: 30,
    createdBy: ADMIN_ID,
    createdAt: PAST_DATE,
    updatedAt: PAST_DATE,
    isActive: true,
  },
];

// ── Assessment Reports ─────────────────────────────────────────────────────────
const reports = [
  {
    id: randomUUID(),
    assessmentId: ASSESS1_ID,
    assessmentTitle: 'Software Engineer Technical Assessment',
    userId: EMP1_ID,
    userName: 'Alex Chen',
    jobRole: 'Software Engineer',
    submittedAt: PAST_DATE,
    generatedAt: PAST_DATE,
    ...sweScoring,
    questions: SWE_QUESTIONS,
    responses: SWE_RESPONSES,
  },
  {
    id: randomUUID(),
    assessmentId: ASSESS2_ID,
    assessmentTitle: 'Product Manager Skills Assessment',
    userId: EMP2_ID,
    userName: 'Priya Sharma',
    jobRole: 'Product Manager',
    submittedAt: PAST_DATE,
    generatedAt: PAST_DATE,
    ...pmScoring,
    questions: PM_QUESTIONS,
    responses: PM_RESPONSES,
  },
];

// ── Pending Modules (AI Generated, Awaiting Approval) ────────────────────────
const SWE_MODULE = {
  id: MODULE1_ID,
  title: 'Cloud Architecture & CI/CD Mastery',
  description: 'Targeted learning module to close identified skill gaps in Cloud Architecture and CI/CD pipelines for Alex Chen.',
  targetUserId: EMP1_ID,
  targetUserName: 'Alex Chen',
  targetJobRole: 'Software Engineer',
  assessmentId: ASSESS1_ID,
  gapAreas: sweScoring.weakAreas,
  difficulty: 'intermediate',
  estimatedWeeks: 4,
  status: 'approved',
  approvedBy: ADMIN_ID,
  approvedAt: PAST_DATE,
  createdAt: PAST_DATE,
  sessions: [
    {
      id: 1, title: 'Cloud Architecture Fundamentals', objective: 'Understand core cloud patterns: CAP theorem, distributed systems, scalability strategies',
      keyPoints: ['CAP theorem and trade-offs in distributed systems', 'Horizontal vs vertical scaling strategies', 'Cloud-native design patterns: CQRS, Event Sourcing, Saga', 'Choosing between consistency and availability'],
      practiceTask: 'Design a distributed system architecture for a ride-sharing app — choose your CAP trade-offs and justify them',
      durationMinutes: 75,
    },
    {
      id: 2, title: 'Kubernetes Deep Dive', objective: 'Master Kubernetes workload management: Deployments, StatefulSets, Services, and Ingress',
      keyPoints: ['Deployments vs StatefulSets — when to use each', 'Pod scheduling, resource limits, and QoS classes', 'Service types: ClusterIP, NodePort, LoadBalancer', 'Persistent Volumes and StorageClasses'],
      practiceTask: 'Deploy a 3-tier application (frontend, API, database) on a local Kubernetes cluster using minikube',
      durationMinutes: 90,
    },
    {
      id: 3, title: 'CI/CD Pipeline Engineering', objective: 'Build production-grade CI/CD pipelines with GitHub Actions and Docker',
      keyPoints: ['GitHub Actions workflow anatomy', 'Docker multi-stage builds for efficiency', 'Canary and blue-green deployment strategies', 'Rollback automation and health checks'],
      practiceTask: 'Build a complete GitHub Actions pipeline: lint → test → build Docker image → push to registry → deploy with canary strategy',
      durationMinutes: 90,
    },
    {
      id: 4, title: 'Database Optimization & Read Replicas', objective: 'Master PostgreSQL performance: indexing, read replicas, query optimization',
      keyPoints: ['Index types: B-tree, Hash, GiST, partial indexes', 'Read replica setup and routing strategies', 'EXPLAIN ANALYZE — reading query plans', 'Connection pooling with PgBouncer'],
      practiceTask: 'Optimize a slow-running PostgreSQL query from 3s to under 100ms using proper indexing and query restructuring',
      durationMinutes: 60,
    },
  ],
  learningOutcomes: ['Design distributed systems with confident CAP trade-off decisions', 'Deploy and manage containerized applications on Kubernetes', 'Build automated CI/CD pipelines with canary deployments', 'Optimize database performance using indexing and read replicas'],
};

const PM_MODULE = {
  id: MODULE2_ID,
  title: 'Data-Driven Product Management',
  description: 'Targeted module to strengthen data analysis, A/B testing, and statistical thinking for Priya Sharma.',
  targetUserId: EMP2_ID,
  targetUserName: 'Priya Sharma',
  targetJobRole: 'Product Manager',
  assessmentId: ASSESS2_ID,
  gapAreas: pmScoring.weakAreas,
  difficulty: 'intermediate',
  estimatedWeeks: 3,
  status: 'approved',
  approvedBy: ADMIN_ID,
  approvedAt: PAST_DATE,
  createdAt: PAST_DATE,
  sessions: [
    {
      id: 1, title: 'Statistical Thinking for Product Managers', objective: 'Understand statistical concepts that drive good product decisions',
      keyPoints: ['Statistical significance: what p < 0.05 actually means', 'Sample size calculation — avoiding underpowered tests', 'Type I and Type II errors in A/B testing', 'Confidence intervals vs p-values'],
      practiceTask: 'Audit 3 A/B tests from your backlog — calculate minimum sample sizes and check if they were statistically valid',
      durationMinutes: 60,
    },
    {
      id: 2, title: 'A/B Testing in Practice', objective: 'Run rigorous A/B experiments from hypothesis to ship decision',
      keyPoints: ['Forming falsifiable hypotheses', 'Selecting the right primary metric', 'Novelty effects and how to account for them', 'When to stop a test early — and when not to'],
      practiceTask: 'Design a complete A/B test plan for a checkout flow change: hypothesis, metrics, sample size, duration, success criteria',
      durationMinutes: 75,
    },
    {
      id: 3, title: 'SQL for Product Analytics', objective: 'Write SQL queries to independently answer product questions without waiting for data team',
      keyPoints: ['Funnel analysis with window functions', 'Cohort retention queries', 'Calculating DAU/MAU/WAU', 'Revenue metrics: MRR, ARR, LTV, churn rate'],
      practiceTask: 'Write 5 SQL queries that answer: retention by cohort, activation funnel, feature adoption rate, NPS correlation, and revenue churn',
      durationMinutes: 90,
    },
  ],
  learningOutcomes: ['Design and interpret A/B tests with statistical rigor', 'Write complex SQL queries to independently extract product insights', 'Apply statistical thinking to product decisions with confidence'],
};

const pendingModules = [SWE_MODULE, PM_MODULE];

// ── Module Assignments (modules visible in employee dashboard) ─────────────────
const moduleAssignments = [
  {
    id: randomUUID(),
    moduleId: MODULE1_ID,
    userId: EMP1_ID,
    assignedBy: ADMIN_ID,
    assignedAt: PAST_DATE,
    status: 'in_progress',
    progress: 25,
    sessionProgress: { 1: 'completed', 2: 'in_progress', 3: 'not_started', 4: 'not_started' },
    startedAt: PAST_DATE,
    module: SWE_MODULE,
  },
  {
    id: randomUUID(),
    moduleId: MODULE2_ID,
    userId: EMP2_ID,
    assignedBy: ADMIN_ID,
    assignedAt: PAST_DATE,
    status: 'not_started',
    progress: 0,
    sessionProgress: {},
    startedAt: null,
    module: PM_MODULE,
  },
];

// ── Companies (Super Admin view) ──────────────────────────────────────────────
const companies = [
  { id: COMPANY_ID, name: 'Acme Corp', adminEmail: 'admin@demo.com', adminName: 'Sarah Johnson', employeeCount: 3, plan: 'enterprise', status: 'active', createdAt: PAST_DATE },
  { id: 'company_demo_02', name: 'TechVentures Inc', adminEmail: 'admin@techventures.com', adminName: 'Michael Torres', employeeCount: 47, plan: 'business', status: 'active', createdAt: PAST_DATE },
  { id: 'company_demo_03', name: 'GlobalRetail Ltd', adminEmail: 'admin@globalretail.com', adminName: 'Emma Wilson', employeeCount: 124, plan: 'enterprise', status: 'active', createdAt: PAST_DATE },
];

// ── CareerTwin / Learning Velocity data ───────────────────────────────────────
const careerProfiles = {
  [EMP1_ID]: {
    userId: EMP1_ID,
    userName: 'Alex Chen',
    jobRole: 'Software Engineer',
    learningDNA: 'Deep Diver',
    learningDNADescription: 'Detail-focused and mastery-oriented — Alex digs deep into topics before moving on',
    careerReadinessScore: 72,
    velocityTrend: 'accelerating',
    topStrengths: ['React Development', 'Node.js APIs', 'Database Design'],
    careerInsight: 'Alex shows strong foundational skills in React and Node.js. Cloud architecture and CI/CD are the priority development areas that will unlock the next career level. With focused effort over 4 weeks, a senior-level readiness score of 85+ is achievable.',
    nextMilestone: 'Senior Software Engineer',
    timelineWeeks: 16,
    marketDemandScore: 89,
    skillsRadar: [
      { skill: 'React', current: 82, target: 90 },
      { skill: 'Node.js', current: 78, target: 88 },
      { skill: 'System Design', current: 60, target: 80 },
      { skill: 'Cloud/K8s', current: 45, target: 80 },
      { skill: 'CI/CD', current: 50, target: 85 },
      { skill: 'Databases', current: 65, target: 85 },
    ],
    velocityHistory: [
      { date: '2025-10', score: 55 }, { date: '2025-11', score: 60 },
      { date: '2025-12', score: 58 }, { date: '2026-01', score: 65 },
      { date: '2026-02', score: 68 }, { date: '2026-03', score: 72 },
    ],
    generatedAt: PAST_DATE,
  },
  [EMP2_ID]: {
    userId: EMP2_ID,
    userName: 'Priya Sharma',
    jobRole: 'Product Manager',
    learningDNA: 'Eagle',
    learningDNADescription: 'Big-picture thinker who quickly connects concepts and sees strategic patterns',
    careerReadinessScore: 81,
    velocityTrend: 'steady',
    topStrengths: ['Product Strategy', 'Agile/Scrum', 'Stakeholder Communication'],
    careerInsight: 'Priya demonstrates exceptional strategic and communication skills. The data analysis gap is the key unlock — strengthening SQL and A/B testing rigor will elevate Priya from strong PM to data-driven product leader. Senior PM readiness is 6-8 weeks away.',
    nextMilestone: 'Senior Product Manager',
    timelineWeeks: 8,
    marketDemandScore: 84,
    skillsRadar: [
      { skill: 'Strategy', current: 90, target: 95 },
      { skill: 'Agile', current: 85, target: 90 },
      { skill: 'User Research', current: 82, target: 88 },
      { skill: 'Prioritization', current: 75, target: 85 },
      { skill: 'Data Analysis', current: 55, target: 80 },
      { skill: 'A/B Testing', current: 48, target: 78 },
    ],
    velocityHistory: [
      { date: '2025-10', score: 68 }, { date: '2025-11', score: 72 },
      { date: '2025-12', score: 75 }, { date: '2026-01', score: 77 },
      { date: '2026-02', score: 79 }, { date: '2026-03', score: 81 },
    ],
    generatedAt: PAST_DATE,
  },
};

// ── Write All Files ────────────────────────────────────────────────────────────
console.log('\n🚀 TalentForge Demo Seeder\n');

// Merge with existing users (don't overwrite if already there)
const existingUsers = read('users.json', { users: [], nextUserId: 1 });
const existingEmails = new Set(existingUsers.users.map(u => u.email));
const newUsers = users.users.filter(u => !existingEmails.has(u.email));
const mergedUsers = {
  nextUserId: Math.max(existingUsers.nextUserId || 1, users.nextUserId),
  users: [...existingUsers.users, ...newUsers],
};
write('users.json', mergedUsers);
console.log(`✅ Users: ${newUsers.length} created (${mergedUsers.users.length} total)`);

// Assessments — append
const existingAssessments = read('assessments.json', []);
const existingAssessIds = new Set(existingAssessments.map(a => a.id));
const newAssessments = assessments.filter(a => !existingAssessIds.has(a.id));
write('assessments.json', [...existingAssessments, ...newAssessments]);
console.log(`✅ Assessments: ${newAssessments.length} created`);

// Reports — append
const existingReports = read('assessment_reports.json', []);
write('assessment_reports.json', [...existingReports, ...reports]);
console.log(`✅ Assessment reports: ${reports.length} created`);

// Pending Modules
const existingPending = read('pending_modules.json', []);
const existingPendingIds = new Set(existingPending.map(m => m.id));
const newPending = pendingModules.filter(m => !existingPendingIds.has(m.id));
write('pending_modules.json', [...existingPending, ...newPending]);
console.log(`✅ Learning modules: ${newPending.length} created (approved)`);

// Module Assignments
const existingAssignments = read('module_assignments.json', []);
write('module_assignments.json', [...existingAssignments, ...moduleAssignments]);
console.log(`✅ Module assignments: ${moduleAssignments.length} created`);

// Companies
write('companies.json', companies);
console.log(`✅ Companies: ${companies.length} created`);

// Career Profiles
write('career_profiles.json', careerProfiles);
console.log(`✅ CareerTwin profiles: ${Object.keys(careerProfiles).length} created`);

console.log('\n─────────────────────────────────────────────────────────');
console.log('🎉 Demo data ready! Login credentials:\n');
console.log('  Super Admin  →  superadmin@talentforge.ai  /  Admin@123');
console.log('  Admin        →  admin@demo.com             /  Admin@123');
console.log('  Employee 1   →  alex@demo.com              /  Employee@123');
console.log('  Employee 2   →  priya@demo.com             /  Employee@123');
console.log('  Employee 3   →  james@demo.com             /  Employee@123');
console.log('─────────────────────────────────────────────────────────');
console.log('\n📍 Key demo pages:');
console.log('  Agent Swarm (no login):  http://localhost:5173/agent-swarm');
console.log('  Admin Dashboard:         http://localhost:5173/admin/dashboard');
console.log('  Assessment Management:   http://localhost:5173/admin/assessments');
console.log('  Employee CareerTwin:     http://localhost:5173/career-twin');
console.log('  Super Admin:             http://localhost:5173/superadmin/dashboard\n');
