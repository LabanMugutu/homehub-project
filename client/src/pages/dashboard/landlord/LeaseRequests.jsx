import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import api from '../../../api/axios';
import { FaCheck, FaTimes, FaUser, FaCalendarAlt } from 'react-icons/fa';

const LeaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/leases');
        // Filter only 'pending' status
        setRequests(res.data.filter(r => r.status === 'pending'));
      } catch (error) {
        console.error("Error fetching requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    if(!window.confirm(`Are you sure you want to ${status} this tenant?`)) return;
    try {
      await api.post(`/leases/${id}/status`, { status: status === 'approve' ? 'approved' : 'rejected' });
      // Remove from list
      setRequests(requests.filter(r => r.id !== id));
      alert(`Application ${status}d!`);
    } catch (error) {
      alert("Action failed.");
    }
  };

  return (
    <DashboardLayout title="Lease Applications" role="landlord">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Incoming Tenant Requests</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Checking for applications...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No pending applications at the moment.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map(req => (
              <div key={req.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50">
                
                {/* Info Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-brand-blue text-xs font-bold px-2 py-1 rounded uppercase">New Request</span>
                    <h3 className="font-bold text-gray-800">{req.property_title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400"/> 
                        <span>Tenant: <strong>{req.tenant_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400"/> 
                        <span>Move-in: {new Date(req.start_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAction(req.id, 'reject')}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
                  >
                    <FaTimes /> Reject
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'approve')}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-900 font-medium transition shadow-sm"
                  >
                    <FaCheck /> Approve Lease
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaseRequests;