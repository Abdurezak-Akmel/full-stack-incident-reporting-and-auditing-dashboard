import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';

// Helper component to protect routes based on JWT and Role
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) return <Navigate to="/" />;
  
  // If a specific role is required and user doesn't have it, redirect them to their own dashboard
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Routes>
          {/* Public Access */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Normal User Protected Route */}
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute roleRequired="user">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Route */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirect any unknown route to Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;