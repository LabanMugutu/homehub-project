import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import api from '../../../api/axios';
import { FaTools, FaCheck, FaSpinner, FaUser, FaPhone, FaMapMarkerAlt, FaSync } from 'react-icons/fa';

const LandlordMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  const fetchRequests = async () => {
    try {
      const res = await api.get('/maintenance');
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Status Change
  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Mark this request as ${newStatus.replace('_', ' ')}?`)) return;

    // Optimistic Update (Update UI instantly)
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));

    try {
      await api.patch(`/maintenance/${id}`, { status: newStatus });
    } catch (err) {
      alert("Failed to update status");
      fetchRequests(); // Revert on error
    }
  };

  return (
    <DashboardLayout title="Maintenance Requests" role="landlord">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaTools className="text-blue-600" /> Tenant Issues
          </h2>
          <button onClick={fetchRequests} className="text-gray-400 hover:text-blue-600">
            <FaSync />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
            Loading issues...
          </div>
        ) : requests.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">Issue Details</th>
                <th className="p-4">Tenant / Unit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 align-top max-w-xs">
                    <p className="font-bold text-gray-800 mb-1">{req.title}</p>
                    <p className="text-gray-500 text-xs">{req.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Priority: <span className={`uppercase font-bold ${
                        req.priority === 'high' ? 'text-red-600' : 'text-gray-500'
                      }`}>{req.priority}</span>
                    </p>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 text-gray-800 font-medium">
                        <FaUser className="text-gray-400 text-xs" /> {req.tenant_name}
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-xs">
                        <FaMapMarkerAlt /> {req.property_name} ({req.unit_number})
                      </span>
                      {req.tenant_phone && (
                        <span className="flex items-center gap-2 text-blue-600 text-xs">
                          <FaPhone /> {req.tenant_phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === 'completed' ? 'bg-green-100 text-green-700' :
                      req.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 align-top text-right">
                    <div className="flex flex-col gap-2 items-end">
                      {req.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(req.id, 'in_progress')}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                        >
                          Mark In Progress
                        </button>
                      )}
                      
                      {req.status !== 'completed' && (
                        <button 
                          onClick={() => handleStatusUpdate(req.id, 'completed')}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center gap-1"
                        >
                          <FaCheck /> Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-16 text-center text-gray-400">
            <FaTools className="mx-auto text-4xl mb-4 text-gray-200" />
            <p>No maintenance requests found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LandlordMaintenance;