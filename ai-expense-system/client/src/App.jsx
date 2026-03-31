import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import DashboardEmployee from './components/DashboardEmployee';
import DashboardManager from './components/DashboardManager';
import DashboardAdmin from './components/DashboardAdmin';

const ProtectedRoute = ({ children, roles }) => {
  const { user, token } = useContext(AuthContext);
  if (!token) return <Navigate to="/" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <Router>
      <div className="min-h-screen w-full relative">
        {user && (
          <nav className="fixed top-0 w-full z-50 glass-panel mt-4 mx-4 px-6 py-4 flex justify-between items-center max-w-[calc(100%-2rem)]">
            <h1 className="text-xl font-bold gradient-text">AI Reimbursement System</h1>
            <div className="flex items-center gap-6">
              <span className="text-sm text-slate-300">Welcome, {user.name}</span>
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-semibold">{user.role}</span>
              <button onClick={logout} className="text-sm text-slate-400 hover:text-white transition-colors">Logout</button>
            </div>
          </nav>
        )}
        
        <div className="pt-28 px-6 pb-12 w-full max-w-7xl mx-auto h-full space-y-8">
          <Routes>
            <Route path="/" element={!user ? <Login /> : <Navigate to={`/dashboard-${user.role.toLowerCase()}`} />} />
            
            <Route path="/dashboard-employee" element={
              <ProtectedRoute roles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <DashboardEmployee />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard-manager" element={
              <ProtectedRoute roles={['MANAGER', 'ADMIN']}>
                <DashboardManager />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard-admin" element={
              <ProtectedRoute roles={['ADMIN']}>
                <DashboardAdmin />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
