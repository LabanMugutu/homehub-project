import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace'; // NEW

// Landlord Pages
import LandlordOverview from './pages/dashboard/LandlordOverview';
import LandlordNotifications from './pages/dashboard/LandlordNotifications'; // NEW
import Properties from './pages/dashboard/Properties';
import Profile from './pages/dashboard/Profile';

// Tenant Pages
import TenantDashboard from './pages/dashboard/TenantDashboard'; // NEW

// Admin Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/marketplace" element={<Marketplace />} /> {/* View Properties Tab */}
        
        {/* Landlord Routes */}
        <Route path="/landlord/dashboard" element={<LandlordOverview />} />
        <Route path="/landlord/notifications" element={<LandlordNotifications />} />
        <Route path="/landlord/properties" element={<Properties />} />
        <Route path="/landlord/profile" element={<Profile />} />
        
        {/* Tenant Routes */}
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;