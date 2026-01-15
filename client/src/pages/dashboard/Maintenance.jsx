import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaTools, FaPlus, FaCheckCircle, FaExclamationCircle, FaSpinner, FaHome, FaLock } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext.jsx';

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [activeLeases, setActiveLeases] = useState([]); 
  const [pendingLeases, setPendingLeases] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ 
    unit_id: '', 
    title: '', 
    description: '', 
    priority: 'medium' 
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, leaseRes] = await Promise.all([
          api.get('/maintenance'),
          api.get('/leases')
        ]);

        setRequests(reqRes.data);
        
        // Filter Leases
        const leases = leaseRes.data || [];
        const active = leases.filter(l => l.status?.toLowerCase() === 'active');
        const pending = leases.filter(l => l.status?.toLowerCase() === 'pending');

        setActiveLeases(active);
        setPendingLeases(pending);

      } catch (err) {
        console.error("Data load error:", err);
        addToast("Failed to load maintenance data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🟢 2. THE WATCHER (Guarantees Auto-Selection)
  // This runs automatically whenever 'activeLeases' updates.
  useEffect(() => {
    if (activeLeases.length === 1) {
      console.log("🟢 Auto-selecting single property:", activeLeases[0].property_name);
      setFormData(prev => ({ 
        ...prev, 
        unit_id: activeLeases[0].unit_id // Force the ID into the form
      }));
    }
  }, [activeLeases]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/maintenance', formData);
      
      // Add the new request to the list (optimistic update)
      setRequests([res.data.request || res.data, ...requests]);
      
      addToast("Maintenance request submitted successfully!", "success");

      // Reset form, but preserve unit_id if only one lease
      setFormData({
        unit_id: activeLeases.length === 1 ? activeLeases[0].unit_id : '',
        title: '',
        description: '',
        priority: 'medium'
      });

    } catch (err) {
      console.error("Submission error:", err);
      const errorMsg = err.response?.data?.error || "Failed to submit maintenance request";
      addToast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Maintenance" role="tenant">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM SECTION */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FaPlus className="text-blue-600" /> Report New Issue
          </h2>

          {/* 🟢 VISUAL DEBUGGER (Remove this div after testing if you want) */}
          <div className="text-xs text-gray-400 mb-4 pb-2 border-b border-gray-100">
             System Status: Found {activeLeases.length} Active Lease(s). 
             {activeLeases.length === 1 && " Auto-Select Active."}
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
              {message.text}
            </div>
          )}

          {/* WARNING: Pending but No Active */}
          {activeLeases.length === 0 && pendingLeases.length > 0 && (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm mb-6 border border-yellow-200">
              <strong className="flex items-center gap-2 mb-1"><FaLock /> Lease Pending Approval</strong>
              <p>Your lease for <strong>{pendingLeases[0].property_name}</strong> is awaiting landlord approval.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 🟢 ROBUST PROPERTY SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Property</label>
              
              {activeLeases.length > 1 ? (
                // SCENARIO A: Multiple Properties -> Dropdown
                <div className="relative">
                  <select 
                    required
                    className="w-full border rounded-lg p-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={formData.unit_id}
                    onChange={e => setFormData({...formData, unit_id: e.target.value})}
                  >
                    <option value="">-- Select Property --</option>
                    {activeLeases.map(lease => (
                      <option key={lease.id} value={lease.unit_id}>
                        {lease.property_name || "Unknown Property"} ({lease.unit_number})
                      </option>
                    ))}
                  </select>
                  <FaHome className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>

              ) : activeLeases.length === 1 ? (
                // SCENARIO B: Single Property -> Read-Only Input
                <div className="relative">
                  <input 
                    type="text" 
                    value={activeLeases[0].property_name || "Your Property"} 
                    disabled
                    className="w-full border rounded-lg p-3 text-sm bg-gray-100 text-gray-700 font-bold cursor-not-allowed"
                  />
                  <FaLock className="absolute right-3 top-3.5 text-gray-400" />
                </div>

              ) : (
                // SCENARIO C: No Active Leases -> Disabled Input
                <input 
                  disabled 
                  placeholder="No active leases found"
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Issue Title</label>
              <input 
                required 
                disabled={activeLeases.length === 0}
                type="text" 
                placeholder="e.g. Leaking Sink"
                className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Priority</label>
              <select 
                disabled={activeLeases.length === 0}
                className="w-full border rounded-lg p-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="medium">Medium - General Repair</option>
                <option value="low">Low - Cosmetic Issue</option>
                <option value="high">High - Emergency/Safety</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
              <textarea 
                required 
                disabled={activeLeases.length === 0}
                rows="4" 
                placeholder="Describe the issue..."
                className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <button 
              disabled={submitting || activeLeases.length === 0}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* HISTORY LIST */}
        <div className="lg:col-span-2">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaTools className="text-gray-400" /> Request History
          </h2>
          
          {loading ? (
            <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-blue-500"/></div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{req.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                           {req.property_name || "Unknown Property"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{req.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      req.status === 'completed' ? 'bg-green-100 text-green-700' :
                      req.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200 text-gray-400">
              No maintenance requests found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
