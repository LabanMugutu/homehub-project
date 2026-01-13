import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaCheck, FaTimes, FaBuilding, FaUserShield } from 'react-icons/fa';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL properties (The backend returns everything)
  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (error) {
      console.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handle Approve/Reject Logic
  const handleReview = async (id, action) => {
    const endpoint = action === 'approve' ? 'approve' : 'reject';
    if(!window.confirm(`Are you sure you want to ${action} this property?`)) return;

    try {
      await api.post(`/properties/${id}/${endpoint}`, { comment: `Admin ${action}ed` });
      // Update UI instantly
      setProperties(properties.map(p => 
        p.id === id ? { ...p, status: action === 'approve' ? 'approved' : 'rejected' } : p
      ));
      alert(`Property ${action}d successfully!`);
    } catch (error) {
      alert("Action failed. Ensure you are logged in as Admin.");
    }
  };

  // Filter for Pending items
  const pendingProperties = properties.filter(p => p.status === 'pending');

  return (
    <DashboardLayout title="Admin Portal" role="admin">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-brand-blue"><FaUserShield size={24}/></div>
          <div><h3 className="text-2xl font-bold">Admin</h3><p className="text-gray-500">Super User</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-yellow-100 p-4 rounded-full text-brand-gold"><FaBuilding size={24}/></div>
          <div><h3 className="text-2xl font-bold">{pendingProperties.length}</h3><p className="text-gray-500">Pending Review</p></div>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Pending Property Approvals</h2>
        </div>
        
        {pendingProperties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No properties pending review. Good job!</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Landlord</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingProperties.map(prop => (
                <tr key={prop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{prop.title}</p>
                    <p className="text-xs text-gray-500">{prop.city}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ID: {prop.landlord_id.substring(0,8)}...
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    KES {prop.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleReview(prop.id, 'approve')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-bold text-sm"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReview(prop.id, 'reject')}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-bold text-sm"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;