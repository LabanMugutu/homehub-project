import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleDeleteAccount = async () => {
    // 1. Confirm Intent
    const confirm = window.confirm(
      "Are you absolutely sure? This will delete your account, leases, and all data permanently. This action cannot be undone."
    );

    if (!confirm) return;

    try {
      setLoading(true);
      // 2. Call the new Backend Route
      await api.delete('/users/profile');
      
      // 3. Cleanup Local Storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 4. Redirect
      alert("Account deleted successfully.");
      navigate('/register');
      
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.error || "Failed to delete account. Please ensure you have no active conflicts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Account Settings" role={user.role}>
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaUser className="text-blue-600" /> My Profile
          </h2>
          
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1">Full Name</label>
              <input 
                type="text" 
                value={user.full_name} 
                disabled 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1">Email Address</label>
              <input 
                type="text" 
                value={user.email} 
                disabled 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1">Role</label>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-8 rounded-xl border border-red-100">
          <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <FaExclamationTriangle /> Danger Zone
          </h2>
          <p className="text-red-600 mb-6 text-sm">
            Once you delete your account, there is no going back. All your data, including leases and maintenance history, will be permanently removed.
          </p>
          
          <button 
            onClick={handleDeleteAccount}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition shadow-sm"
          >
            {loading ? 'Processing...' : (
              <>
                <FaTrash /> Delete My Account
              </>
            )}
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;