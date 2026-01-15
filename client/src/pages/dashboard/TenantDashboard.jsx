import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { 
  FaFileContract, FaCalendarCheck, FaTools, FaHistory, 
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaPlus, FaExclamationTriangle 
} from 'react-icons/fa';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('lease');
  const [leases, setLeases] = useState([]);
  const [maintenance, setMaintenance] = useState([]); // 🟢 Store maintenance requests
  const [loading, setLoading] = useState(true);
  
  // 🟢 Maintenance Form State
  const [newRequest, setNewRequest] = useState({ title: '', description: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Leases on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaseRes, maintRes] = await Promise.all([
          api.get('/leases'),
          api.get('/maintenance') // 🟢 Fetch maintenance history too
        ]);
        console.log("Leases:", leaseRes.data);
        setLeases(leaseRes.data);
        setMaintenance(maintRes.data);
      } catch (err) {
        console.error("Dashboard Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🟢 Helper: Find Active Lease
  const activeLease = leases.find(l => l.status?.toLowerCase() === 'active');

  // 🟢 Helper: Handle Maintenance Submit
  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    if (!activeLease) return alert("You must have an active lease to report issues.");
    
    setSubmitting(true);
    try {
      // Backend auto-detects unit based on your token, no need to send unit_id
      const res = await api.post('/maintenance', newRequest);
      
      // Update local list
      setMaintenance([res.data.request, ...maintenance]);
      setNewRequest({ title: '', description: '', priority: 'medium' }); // Reset form
      alert("Maintenance request sent to landlord!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Tenant Portal" role="tenant">
      
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('lease')} 
          className={`pb-2 px-4 font-bold transition-all ${activeTab === 'lease' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-400'}`}
        >
          <FaFileContract className="inline mr-2" /> My Lease & Applications
        </button>
        <button 
          onClick={() => setActiveTab('maintenance')} 
          className={`pb-2 px-4 font-bold transition-all ${activeTab === 'maintenance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-400'}`}
        >
          <FaTools className="inline mr-2" /> Maintenance
        </button>
      </div>

      {/* ================= LEASE TAB ================= */}
      {activeTab === 'lease' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Active Lease Card */}
          {activeLease ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-8 shadow-lg">
                <h3 className="text-blue-100 uppercase text-xs font-bold mb-2 tracking-wider">Rent Amount</h3>
                <div className="text-5xl font-bold mb-4">Ksh {activeLease.rent_amount?.toLocaleString()}</div>
                <div className="flex items-center gap-2 mb-8 text-blue-50">
                  <FaCalendarCheck /> Move-in: <strong>{activeLease.start_date ? new Date(activeLease.start_date).toLocaleDateString() : 'N/A'}</strong>
                </div>
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition shadow-md">Pay Rent</button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-gray-800 font-bold text-lg mb-6 border-b pb-2">Agreement Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Property</span>
                    <span className="font-bold text-gray-800">{activeLease.property_name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Expiry Date</span>
                    <span className="font-bold text-red-500">{activeLease.end_date ? new Date(activeLease.end_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="mt-4">
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                      ACTIVE LEASE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-10 rounded-xl border border-dashed border-blue-200 text-center">
               <FaHistory className="mx-auto text-blue-200 text-3xl mb-3" />
               <p className="text-blue-700 font-medium">No active lease agreement found.</p>
               <p className="text-blue-500 text-sm mt-1">Once approved, your rent details will appear here.</p>
            </div>
          )}

          {/* Application History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 font-bold text-gray-800 flex items-center gap-2 bg-gray-50">
              <FaHistory className="text-blue-500" /> 
              <span>Application History</span>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading...</div>
              ) : leases.length > 0 ? (
                leases.map(l => (
                  <div key={l.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-gray-800">{l.property_name || 'HomeHub Property'}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied: {l.created_at ? new Date(l.created_at).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                    <span className={`flex items-center gap-2 text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
                      l.status?.toLowerCase() === 'active' ? 'bg-green-50 text-green-600 border-green-200' :
                      l.status?.toLowerCase() === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {l.status?.toLowerCase() === 'active' ? <FaCheckCircle /> : 
                       l.status?.toLowerCase() === 'pending' ? <FaHourglassHalf /> : <FaTimesCircle />} 
                      {l.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400 italic">No history found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAINTENANCE TAB ================= */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left: Request Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-500" /> Report New Issue
            </h3>
            
            {activeLease ? (
              <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Issue Title</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Leaking Sink"
                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newRequest.title}
                    onChange={e => setNewRequest({...newRequest, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Priority</label>
                  <select 
                    className="w-full border rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newRequest.priority}
                    onChange={e => setNewRequest({...newRequest, priority: e.target.value})}
                  >
                    <option value="low">Low (Cosmetic)</option>
                    <option value="medium">Medium (General)</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                  <textarea 
                    required 
                    rows="4" 
                    placeholder="Describe the problem..."
                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={newRequest.description}
                    onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            ) : (
              <div className="bg-yellow-50 p-6 rounded-lg text-yellow-700 text-center text-sm">
                <FaExclamationTriangle className="mx-auto text-2xl mb-2" />
                You must have an <strong>Active Lease</strong> to submit maintenance requests.
              </div>
            )}
          </div>

          {/* Right: Request History */}
          <div className="lg:col-span-2 space-y-4">
             <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <FaHistory className="text-blue-500" /> Request History
            </h3>
            {maintenance.length > 0 ? (
              maintenance.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start shadow-sm hover:shadow-md transition">
                  <div>
                    <h4 className="font-bold text-gray-800">{req.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                    <p className="text-xs text-gray-400 mt-3">Submitted: {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === 'completed' ? 'bg-green-100 text-green-700' :
                      req.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status?.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-bold uppercase ${
                      req.priority === 'high' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {req.priority} Priority
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-12 text-center rounded-xl border border-dashed text-gray-400">
                No maintenance requests found.
              </div>
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default TenantDashboard;
