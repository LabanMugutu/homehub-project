import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import api from '../../../api/axios';
import { 
  FaUserShield, FaBuilding, FaCheckCircle, FaTimesCircle, FaIdCard, FaMapMarkerAlt, FaSync 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingLandlords, setPendingLandlords] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch specifically from the new admin endpoints
      const [landlordsRes, propsRes] = await Promise.all([
        api.get('/admin/landlords/pending'),
        api.get('/admin/properties/pending')
      ]);
      setPendingLandlords(landlordsRes.data);
      setPendingProperties(propsRes.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ACTIONS ---
  const verifyLandlord = async (id, action) => {
    if(!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await api.patch(`/admin/landlords/${id}/verify`, { action });
      setPendingLandlords(prev => prev.filter(l => l.id !== id));
      alert(`Landlord ${action}ed successfully.`);
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.error || err.message));
    }
  };

  const verifyProperty = async (id, action) => {
    if(!window.confirm(`Are you sure you want to ${action} this property?`)) return;
    try {
      await api.patch(`/admin/properties/${id}/verify`, { action });
      setPendingProperties(prev => prev.filter(p => p.id !== id));
      alert(`Property ${action}ed successfully.`);
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.error || err.message));
    }
  };

  // --- UI COMPONENTS ---
  const TabButton = ({ id, label, count, icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-all ${
        activeTab === id 
          ? 'border-blue-600 text-blue-600 bg-blue-50' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      {label}
      {count > 0 && (
        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full ml-1">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <DashboardLayout title="Admin Control Center" role="admin">
      {/* HEADER STATS */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800">System Status</h2>
          <p className="text-gray-500 text-sm">Overview of pending verifications</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="text-center px-6 border-r border-gray-100">
            <p className="text-2xl font-bold text-blue-600">{pendingLandlords.length}</p>
            <p className="text-xs uppercase font-bold text-gray-400">Landlords Pending</p>
          </div>
          <div className="text-center px-6">
            <p className="text-2xl font-bold text-purple-600">{pendingProperties.length}</p>
            <p className="text-xs uppercase font-bold text-gray-400">Properties Pending</p>
          </div>
          <button onClick={fetchData} className="ml-4 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600">
            <FaSync className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <TabButton id="overview" label="Overview" count={0} icon={<FaUserShield />} />
          <TabButton id="landlords" label="Verify Landlords" count={pendingLandlords.length} icon={<FaIdCard />} />
          <TabButton id="properties" label="Verify Properties" count={pendingProperties.length} icon={<FaBuilding />} />
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-400">Loading data...</div>
          ) : (
            <>
              {/* === TAB 1: OVERVIEW === */}
              {activeTab === 'overview' && (
                <div className="text-center py-20">
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserShield className="text-4xl text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Welcome, Administrator</h3>
                  <p className="text-gray-500 max-w-md mx-auto mt-2">
                    Use the tabs above to review pending landlord registrations and property listings.
                  </p>
                </div>
              )}

              {/* === TAB 2: LANDLORDS === */}
              {activeTab === 'landlords' && (
                <div className="space-y-4">
                  {pendingLandlords.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500 font-bold">No pending landlords found.</p>
                        <p className="text-xs text-gray-400 mt-1">New registrations will appear here automatically.</p>
                    </div>
                  ) : (
                    pendingLandlords.map((l) => (
                      <div key={l.id} className="flex flex-col md:flex-row gap-6 p-6 border rounded-xl hover:shadow-md transition bg-white">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-800">{l.full_name}</h4>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold">Pending</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>📧 {l.email}</p>
                            <p>📞 {l.phone}</p>
                            <p>🆔 {l.national_id || "N/A"}</p>
                            <p>📍 KRA: {l.kra_pin || "N/A"}</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-3">Registered: {new Date(l.created_at).toLocaleString()}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2 justify-center min-w-[150px]">
                          <button 
                            onClick={() => verifyLandlord(l.id, 'approve')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-sm shadow-sm"
                          >
                            <FaCheckCircle /> Approve
                          </button>
                          <button 
                            onClick={() => verifyLandlord(l.id, 'reject')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-bold text-sm"
                          >
                            <FaTimesCircle /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* === TAB 3: PROPERTIES === */}
              {activeTab === 'properties' && (
                <div className="grid grid-cols-1 gap-6">
                  {pendingProperties.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500 font-bold">No pending properties.</p>
                    </div>
                  ) : (
                    pendingProperties.map((p) => (
                      <div key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white flex flex-col md:flex-row h-auto md:h-48">
                        <div className="w-full md:w-64 bg-gray-200 relative">
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{p.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{p.location}</p>
                            <div className="flex gap-4 text-sm mt-2">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">KSh {p.price.toLocaleString()}</span>
                                <span className="text-gray-600">Owner: <strong>{p.landlord_name}</strong></span>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <button 
                                onClick={() => verifyProperty(p.id, 'approve')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm"
                            >
                                Approve Listing
                            </button>
                            <button 
                                onClick={() => verifyProperty(p.id, 'reject')}
                                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm"
                            >
                                Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;