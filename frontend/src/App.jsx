import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Buildings from './pages/Buildings';
import Sensors from './pages/Sensors';
import Energy from './pages/Energy';
import Alerts from './pages/Alerts';
import Predictions from './pages/Predictions';
import Security from './pages/Security';
import Sustainability from './pages/Sustainability';
import MapView from './pages/MapView';
import ChatAssistant from './pages/ChatAssistant';
import Settings from './pages/Settings';
import Layout from './components/layout/Layout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="sensors" element={<Sensors />} />
        <Route path="energy" element={<Energy />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="security" element={<Security />} />
        <Route path="sustainability" element={<Sustainability />} />
        <Route path="map" element={<MapView />} />
        <Route path="chat" element={<ChatAssistant />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
