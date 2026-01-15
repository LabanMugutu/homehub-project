import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaCheck, FaTimes, FaUser, FaHome, FaSpinner } from 'react-icons/fa';

const LeaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/leases');
      // Only show pending requests here (Active ones go to "My Properties")
      const pending = res.data.filter(l => l.status === 'pending');
      setRequests(pending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    if(!window.confirm(`Are you sure you want to ${status} this tenant?`)) return;
    try {
      await api.post(`/leases/${id}/status`, { status });
      // Remove from list immediately
      setRequests(requests.filter(r => r.id !== id));
      alert(`Application ${status} successfully!`);
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <DashboardLayout title="Lease Requests" role="landlord">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Incoming Applications</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
            {requests.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400"><FaSpinner className="animate-spin inline mr-2"/> Loading...</div>
        ) : requests.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4 font-semibold">Property / Unit</th>
                <th className="p-4 font-semibold">Tenant Details</th>
                <th className="p-4 font-semibold">Offer / Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><FaHome /></div>
                      <div>
                        <p className="font-bold text-gray-800">{req.property_name}</p>
                        <p className="text-xs text-gray-500">Unit: {req.unit_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><FaUser /></div>
                      <div>
                        <p className="font-bold text-gray-800">{req.tenant_name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{req.tenant_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">KSh {req.rent_amount?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(req.id, 'approved')}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition flex items-center gap-1 font-bold text-xs"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'rejected')}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition flex items-center gap-1 font-bold text-xs"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center text-gray-400">
            No pending lease applications found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaseRequests;