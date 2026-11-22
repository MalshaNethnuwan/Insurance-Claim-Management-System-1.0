import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SubmitClaimWizard from './pages/customer/SubmitClaimWizard';
import CustomerPolicies from './pages/customer/CustomerPolicies';
import CustomerClaims from './pages/customer/CustomerClaims';
import TrackClaim from './pages/customer/TrackClaim';
import CustomerNotifications from './pages/customer/CustomerNotifications';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerClaims from './pages/officer/OfficerClaims';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminOfficers from './pages/admin/AdminOfficers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPolicies from './pages/admin/AdminPolicies';
import AdminClaims from './pages/admin/AdminClaims';

function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user?.role === 'OFFICER') return <Navigate to="/officer" replace />;
  if (user?.role === 'CUSTOMER') return <Navigate to="/customer" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/policies" element={<CustomerPolicies />} />
        <Route path="/customer/submit-claim" element={<SubmitClaimWizard />} />
        <Route path="/customer/claims" element={<CustomerClaims />} />
        <Route path="/customer/track" element={<TrackClaim />} />
        <Route path="/customer/notifications" element={<CustomerNotifications />} />
      </Route>

      {/* Officer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['OFFICER']} />}>
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/officer/claims" element={<OfficerClaims />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/officers" element={<AdminOfficers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/policies" element={<AdminPolicies />} />
        <Route path="/admin/claims" element={<AdminClaims />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
