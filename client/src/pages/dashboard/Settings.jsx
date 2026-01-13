import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaUser, FaLock, FaIdCard, FaSave, FaBuilding, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { role: 'tenant', full_name: 'User', email: '', phone: '' };
  const [activeTab, setActiveTab] = useState('profile');

  // Stub function for updates
  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile update feature coming soon.");
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    const confirmMessage = "Are you sure you want to delete your account? This action cannot be undone.";
    if (!window.confirm(confirmMessage)) return;

    try {
      await api.delete('/users/me'); // Call the backend
      
      // Cleanup and Redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert("Account deleted successfully.");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete account.");
    }
  };

  return (
    <DashboardLayout title="Account Settings" role={user.role}>
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-200 h-fit overflow-hidden">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-6 py-4 border-b border-gray-100 font-medium flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-50 text-brand-blue border-l-4 border-l-brand-blue' : 'text-gray-600'}`}
          >
            <FaUser /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-6 py-4 border-b border-gray-100 font-medium flex items-center gap-3 ${activeTab === 'security' ? 'bg-blue-50 text-brand-blue border-l-4 border-l-brand-blue' : 'text-gray-600'}`}
          >
            <FaLock /> Security
          </button>
          
          {user.role === 'landlord' && (
            <button 
              onClick={() => setActiveTab('verification')}
              className={`w-full text-left px-6 py-4 font-medium flex items-center gap-3 ${activeTab === 'verification' ? 'bg-blue-50 text-brand-blue border-l-4 border-l-brand-blue' : 'text-gray-600'}`}
            >
              <FaIdCard /> Verification
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" defaultValue={user.full_name} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="text" defaultValue={user.phone} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                </div>
              </div>
              <button className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition">
                <FaSave /> Save Changes
              </button>
            </form>
          )}

          {/* VERIFICATION TAB (LANDLORD ONLY) */}
          {activeTab === 'verification' && user.role === 'landlord' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Identity Verification</h3>
              <p className="text-gray-500 mb-6 text-sm">Upload documents to get your properties listed on the marketplace.</p>
              
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <FaIdCard className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-600 font-medium">Upload National ID / Passport</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF (Max 5MB)</p>
                  <button type="button" className="mt-4 text-brand-blue font-bold text-sm hover:underline">Browse Files</button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <FaBuilding className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-600 font-medium">Upload Proof of Ownership (Title Deed)</p>
                  <button type="button" className="mt-4 text-brand-blue font-bold text-sm hover:underline">Browse Files</button>
                </div>
              </div>
            </div>
          )}

           {/* SECURITY TAB (With Delete Option) */}
           {activeTab === 'security' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Security</h3>
              
              <div className="space-y-4 max-w-md mb-12">
                <label className="block text-sm font-bold text-gray-700">Change Password</label>
                <input type="password" placeholder="Current Password" className="w-full px-4 py-2 border rounded-lg" />
                <input type="password" placeholder="New Password" className="w-full px-4 py-2 border rounded-lg" />
                <button className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold">Update Password</button>
              </div>

              {/* DANGER ZONE */}
              <div className="border border-red-200 bg-red-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full text-red-600">
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 text-lg">Delete Account</h4>
                    <p className="text-red-700 text-sm mt-1 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button 
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                    >
                      <FaTrashAlt /> Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;