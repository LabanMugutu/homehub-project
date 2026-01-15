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
      alert("Action failed: " + err.response?.data?.error);
    }
  };

  const verifyProperty = async (id, action) => {
    if(!window.confirm(`Are you sure you want to ${action} this property?`)) return;
    try {
      await api.patch(`/admin/properties/${id}/verify`, { action });
      setPendingProperties(prev => prev.filter(p => p.id !== id));
      alert(`Property ${action}ed successfully.`);
    } catch (err) {
      alert("Action failed: " + err.response?.data?.error);
    }
  };

  // --- RENDER HELPERS ---
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
      
      {/* 1. STATUS HEADER */}
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

      {/* 2. TABS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="flex border-b border-gray-200">
          <TabButton id="overview" label="Overview" count={0} icon={<FaUserShield />} />
          <TabButton id="landlords" label="Verify Landlords" count={pendingLandlords.length} icon={<FaIdCard />} />
          <TabButton id="properties" label="Verify Properties" count={pendingProperties.length} icon={<FaBuilding />} />
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-400">Loading data...</div>
          ) : (
            <>
              {/* === OVERVIEW TAB === */}
              {activeTab === 'overview' && (
                <div className="text-center py-20">
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserShield className="text-4xl text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Welcome, Administrator</h3>
                  <p className="text-gray-500 max-w-md mx-auto mt-2">
                    Use the tabs above to review pending landlord registrations and property listings. 
                    Ensure all documents are valid before approving.
                  </p>
                </div>
              )}

              {/* === LANDLORDS TAB === */}
              {activeTab === 'landlords' && (
                <div className="space-y-4">
                  {pendingLandlords.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No pending landlord verifications.</p>
                  ) : (
                    pendingLandlords.map((l) => (
                      <div key={l.id} className="flex flex-col md:flex-row gap-6 p-6 border rounded-xl hover:shadow-md transition">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800">{l.full_name}</h4>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                            <p><strong>Email:</strong> {l.email}</p>
                            <p><strong>Phone:</strong> {l.phone}</p>
                            <p><strong>National ID:</strong> {l.national_id}</p>
                            <p><strong>KRA PIN:</strong> {l.kra_pin}</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Registered: {new Date(l.created_at).toLocaleDateString()}</p>
                        </div>
                        
                        {/* ID Preview (Placeholder logic if no real image) */}
                        <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            {l.evidence_of_identity ? (
                                <a href={l.evidence_of_identity} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold underline">View ID</a>
                            ) : <span className="text-xs text-gray-400">No ID Uploaded</span>}
                        </div>

                        <div className="flex flex-col gap-2 justify-center">
                          <button 
                            onClick={() => verifyLandlord(l.id, 'approve')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-sm"
                          >
                            <FaCheckCircle /> Approve
                          </button>
                          <button 
                            onClick={() => verifyLandlord(l.id, 'reject')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-bold text-sm"
                          >
                            <FaTimesCircle /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* === PROPERTIES TAB === */}
              {activeTab === 'properties' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingProperties.length === 0 ? (
                    <p className="text-gray-500 text-center col-span-2 py-10">No pending property verifications.</p>
                  ) : (
                    pendingProperties.map((p) => (
                      <div key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
                        <div className="h-48 bg-gray-200 relative">
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                            {p.status}
                          </span>
                        </div>
                        <div className="p-4 flex-1">
                          <h4 className="text-lg font-bold text-gray-800">{p.name}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                            <FaMapMarkerAlt /> {p.location}
                          </p>
                          <div className="flex justify-between text-sm font-bold text-gray-700 border-t pt-3 mt-2">
                            <span>{p.landlord_name}</span>
                            <span>KSh {p.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 flex gap-3 border-t">
                          <button 
                            onClick={() => verifyProperty(p.id, 'approve')}
                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => verifyProperty(p.id, 'reject')}
                            className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold text-sm"
                          >
                            Reject
                          </button>
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