import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css'; // We'll create this

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/common/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import Reports from './pages/Reports';
import Classes from './pages/Classes';
import Courses from './pages/Courses';
import Monitoring from './pages/Monitoring';
import Ratings from './pages/Ratings';
import LoadingSpinner from './components/common/LoadingSpinner';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App dark-theme">
          <Navigation />
          <Container fluid className="mt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/report-form" 
                element={
                  <ProtectedRoute allowedRoles={['lecturer']}>
                    <ReportForm />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/classes" 
                element={
                  <ProtectedRoute>
                    <Classes />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/courses" 
                element={
                  <ProtectedRoute allowedRoles={['program_leader', 'principal_lecturer']}>
                    <Courses />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/monitoring" 
                element={
                  <ProtectedRoute>
                    <Monitoring />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ratings" 
                element={
                  <ProtectedRoute>
                    <Ratings />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;