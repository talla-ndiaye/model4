import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/pages/Dashboard';
import { Teachers } from '@/pages/Teachers';
import { Students } from '@/pages/Students';
import { Subjects } from '@/pages/Subjects';
import { Parents } from '@/pages/Parents';
import { Staff } from '@/pages/Staff';
import { Payments } from '@/pages/Payments';
import { Grades } from '@/pages/Grades';
import { Transport } from '@/pages/Transport';
import { Settings } from '@/pages/Settings';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function AppContent() {
  const { user } = useApp();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;