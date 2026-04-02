import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';

import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Recommendation from './pages/Recommendation';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import Billing from './pages/Billing';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes inside Persistent AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/billing" element={<Billing />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
