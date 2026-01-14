import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import api from '../../../api/axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const LeaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/leases');
      setRequests(res.data.filter(r => r.status === 'pending'));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, status) => {
    const finalStatus = status === 'approve' ? 'approved' : 'rejected';
    if(!window.confirm(`Confirm ${status}?`)) return;
    try {
      await api.post(`/leases/${id}/status`, { status: finalStatus });
      setRequests(prev => prev.filter(r => r.id !== id));
      alert(`Success!`);
    } catch (error) {
      alert(error.response?.data?.error || "Action failed.");
    }
  };

  return (
    <DashboardLayout title="Lease Applications" role="landlord">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
        {requests.map(req => (
          <div key={req.id} className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">{req.property_title}</h3>
              <p className="text-sm text-gray-500">Tenant: {req.tenant_name}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction(req.id, 'reject')} className="px-4 py-2 border text-red-600 rounded-lg">Reject</button>
              <button onClick={() => handleAction(req.id, 'approve')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default LeaseRequests;