import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. Layouts & Components ---
import ScrollToTop from './components/ScrollToTop';

// --- 2. Pages: Public ---
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// --- 3. Pages: Dashboard (Core) ---
import DashboardHome from './pages/dashboard/DashboardHome';
import Settings from './pages/dashboard/Settings';
import Notifications from './pages/dashboard/Notifications';
import Maintenance from './pages/dashboard/Maintenance';;

// 🟢 NEW: Import the specific Tenant Applications page we just created
import Applications from './pages/dashboard/Applications';
import TenantBilling from './pages/dashboard/TenantBilling';

// --- 4. Pages: Landlord Specific ---
import AddProperty from './pages/dashboard/landlord/AddProperty';
import MyProperties from './pages/dashboard/landlord/MyProperties';
import LeaseRequests from './pages/dashboard/landlord/LeaseRequests';
import LandlordMaintenance from './pages/dashboard/landlord/LandlordMaintenance';
import LandlordInvoices from './pages/dashboard/landlord/Invoices';

// --- 5. Pages: Admin Specific ---
import AdminDashboard from './pages/dashboard/AdminDashboard';

// --- 6. PLACEHOLDER COMPONENT ---
const ComingSoon = ({ title }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">🚧 {title}</h1>
    <p className="text-gray-600 mb-8">This feature is currently under development.</p>
    <a href="/dashboard" className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition">
      Back to Dashboard
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/properties" element={<Marketplace />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= DASHBOARD ROUTES ================= */}
        
        {/* 1. Common Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />
        <Route path="/dashboard/maintenance" element={<Maintenance />} />

        {/* 2. Tenant Routes */}
        {/* 🟢 THIS NOW POINTS TO YOUR NEW FILE */}
       <Route path="/dashboard/applications" element={<Applications />} />
       <Route path="/dashboard/favorites" element={<ComingSoon title="Saved Homes" />} />
       <Route path="/dashboard/billing" element={<TenantBilling />} />

        {/* 3. Landlord Routes */}
        <Route path="/dashboard/landlord" element={<MyProperties />} />
        <Route path="/dashboard/landlord/add" element={<AddProperty />} />
        <Route path="/dashboard/landlord/requests" element={<LeaseRequests />} />
        <Route path="/dashboard/landlord/maintenance" element={<LandlordMaintenance />} />
        <Route path="/dashboard/landlord/invoices" element={<LandlordInvoices />} />
        
        {/* 4. Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* ================= PENDING FEATURES ================= */}
        <Route path="/dashboard/payments" element={<ComingSoon title="Payments & Invoices" />} />
        <Route path="/dashboard/messages" element={<ComingSoon title="Messages" />} />

        {/* ================= CATCH-ALL ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;