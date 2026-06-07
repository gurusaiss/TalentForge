import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AiTutorChat from './components/AiTutorChat.jsx';

// Retry lazy imports once on chunk load failure (stale Vercel CDN cache)
const lazyWithRetry = (fn) => lazy(() =>
  fn().catch(() => {
    sessionStorage.setItem('chunk_reload', '1');
    window.location.reload();
    return new Promise(() => {});
  })
);

const Landing              = lazyWithRetry(() => import('./pages/Landing.jsx'));
const Profiling            = lazyWithRetry(() => import('./pages/Profiling.jsx'));
const Diagnostic           = lazyWithRetry(() => import('./pages/Diagnostic.jsx'));
const Dashboard            = lazyWithRetry(() => import('./pages/Dashboard.jsx'));
const Employee             = lazyWithRetry(() => import('./pages/Employee.jsx'));
const DashboardRedirect    = lazyWithRetry(() => import('./components/DashboardRedirect.jsx'));
const Session              = lazyWithRetry(() => import('./pages/Session.jsx'));
const Report               = lazyWithRetry(() => import('./pages/Report.jsx'));
const SimulationLab        = lazyWithRetry(() => import('./pages/SimulationLab.jsx'));
const CareerTwin           = lazyWithRetry(() => import('./pages/CareerTwin.jsx'));
const ExplainabilityConsole = lazyWithRetry(() => import('./pages/ExplainabilityConsole.jsx'));
const DemoMode             = lazyWithRetry(() => import('./pages/DemoMode.jsx'));
const InterviewSimulator   = lazyWithRetry(() => import('./pages/InterviewSimulator.jsx'));

// Auth Pages
const Login                = lazyWithRetry(() => import('./pages/auth/Login.jsx'));
const Register             = lazyWithRetry(() => import('./pages/auth/Register.jsx'));
const Onboarding           = lazyWithRetry(() => import('./pages/auth/Onboarding.jsx'));
const VerifyOTP            = lazyWithRetry(() => import('./pages/auth/VerifyOTP.jsx'));
const ForgotPassword       = lazyWithRetry(() => import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword        = lazyWithRetry(() => import('./pages/auth/ResetPassword.jsx'));
const OAuthCallback        = lazyWithRetry(() => import('./pages/auth/OAuthCallback.jsx'));

// Super Admin Pages
const SuperAdminDashboard  = lazyWithRetry(() => import('./pages/superadmin/SuperAdminDashboard.jsx'));
const AdminManagement      = lazyWithRetry(() => import('./pages/superadmin/AdminManagement.jsx'));

// Profile & Admin Pages
const Profile              = lazyWithRetry(() => import('./pages/Profile.jsx'));
const UserManagement       = lazyWithRetry(() => import('./pages/admin/UserManagement.jsx'));
const AdminDashboard       = lazyWithRetry(() => import('./pages/admin/AdminDashboard.jsx'));
const ManagerDashboard     = lazyWithRetry(() => import('./pages/manager/ManagerDashboard.jsx'));
const AssessmentManagement = lazyWithRetry(() => import('./pages/AssessmentManagement.jsx'));
const Assessment           = lazyWithRetry(() => import('./pages/Assessment.jsx'));
const ModuleManagement     = lazyWithRetry(() => import('./pages/admin/ModuleManagement.jsx'));
const AssignmentManagement = lazyWithRetry(() => import('./pages/admin/AssignmentManagement.jsx'));
const Settings             = lazyWithRetry(() => import('./pages/admin/Settings.jsx'));
const ModuleStart          = lazyWithRetry(() => import('./pages/ModuleStart.jsx'));
const ModuleDashboard      = lazyWithRetry(() => import('./pages/ModuleDashboard.jsx'));
const ModuleSession        = lazyWithRetry(() => import('./pages/ModuleSession.jsx'));
const Certificate          = lazyWithRetry(() => import('./pages/Certificate.jsx'));
const AgentSwarmDemo       = lazyWithRetry(() => import('./pages/AgentSwarmDemoPage.jsx'));

const Loader = () => (
  <div className="mx-auto max-w-4xl px-6 py-14 text-slate-400 text-center">
    <div className="animate-spin text-indigo-400 text-3xl mb-3">⟳</div>
    <div className="text-sm">Loading...</div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
          <Navbar />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"             element={<Landing />} />
              <Route path="/profiling"    element={<Profiling />} />
              <Route path="/diagnostic"   element={<Diagnostic />} />
              <Route path="/settings"    element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Super Admin Routes */}
              <Route path="/superadmin/dashboard" element={
                <ProtectedRoute requiredRole="superadmin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/superadmin/admins" element={
                <ProtectedRoute requiredRole="superadmin">
                  <AdminManagement />
                </ProtectedRoute>
              } />

              {/* Protected Routes - Require Authentication */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/manager/dashboard" element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employee/dashboard" element={
                <ProtectedRoute requiredRole="employee">
                  <Employee />
                </ProtectedRoute>
              } />
              <Route path="/session/:day" element={
                <ProtectedRoute>
                  <Session />
                </ProtectedRoute>
              } />
              <Route path="/report"       element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              } />
              
              {/* Frontier Pages - Protected */}
              <Route path="/simulation"   element={
                <ProtectedRoute>
                  <SimulationLab />
                </ProtectedRoute>
              } />
              <Route path="/career-twin"  element={
                <ProtectedRoute>
                  <CareerTwin />
                </ProtectedRoute>
              } />
              <Route path="/explain"      element={
                <ProtectedRoute>
                  <ExplainabilityConsole />
                </ProtectedRoute>
              } />
              <Route path="/demo"         element={<DemoMode />} />
              <Route path="/agent-swarm" element={<AgentSwarmDemo />} />
              <Route path="/interview"    element={
                <ProtectedRoute>
                  <InterviewSimulator />
                </ProtectedRoute>
              } />
              
              {/* Auth Pages - Public */}
              <Route path="/auth/login"           element={<Login />} />
              <Route path="/auth/register"        element={<Register />} />
              <Route path="/auth/onboarding"      element={<Onboarding />} />
              <Route path="/auth/verify-otp"      element={<VerifyOTP />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password"  element={<ResetPassword />} />
              <Route path="/oauth/callback"       element={<OAuthCallback />} />
              
              {/* Profile & Admin Pages - Protected with Role Requirements */}
              <Route path="/profile"              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin/users"          element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              } />
               <Route path="/admin/assessments"    element={
                 <ProtectedRoute requiredRole={['admin', 'manager']}>
                   <AssessmentManagement />
                 </ProtectedRoute>
               } />
               <Route path="/admin/modules"        element={
                 <ProtectedRoute requiredRole={['admin', 'manager']}>
                   <ModuleManagement />
                 </ProtectedRoute>
               } />
               <Route path="/admin/assignments"    element={
                 <ProtectedRoute requiredRole={['admin', 'manager']}>
                   <AssignmentManagement />
                 </ProtectedRoute>
               } />
              <Route path="/assessment/:assessmentId" element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              } />
              <Route path="/module/:moduleId/start" element={
                <ProtectedRoute>
                  <ModuleStart />
                </ProtectedRoute>
              } />
              <Route path="/module/:moduleId/learn" element={
                <ProtectedRoute>
                  <ModuleDashboard />
                </ProtectedRoute>
              } />
              <Route path="/module/:moduleId/session/:sessionIndex" element={
                <ProtectedRoute>
                  <ModuleSession />
                </ProtectedRoute>
              } />
              <Route path="/certificate" element={
                <ProtectedRoute>
                  <Certificate />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
          <AiTutorChat />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
