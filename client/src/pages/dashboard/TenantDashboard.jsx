import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaFileContract, FaCalendarCheck, FaTools, FaHistory, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('lease');
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leases')
      .then(res => {
        console.log("Fetched Leases Data:", res.data); // 🟢 Debug point
        setLeases(res.data);
      })
      .catch(err => console.error("Lease Fetch Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🟢 CASE-INSENSITIVE STATUS CHECK
  const activeLease = leases.find(l => l.status?.toLowerCase() === 'active');

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

      {activeTab === 'lease' && (
        <div className="space-y-8">
          {/* TOP SECTION: ACTIVE LEASE ONLY */}
          {activeLease ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-8 shadow-lg">
                <h3 className="text-blue-100 uppercase text-xs font-bold mb-2 tracking-wider">Rent Amount</h3>
                <div className="text-5xl font-bold mb-4">Ksh {activeLease.rent_amount?.toLocaleString()}</div>
                <div className="flex items-center gap-2 mb-8 text-blue-50">
                  <FaCalendarCheck /> Move-in: <strong>{activeLease.start_date ? new Date(activeLease.start_date).toLocaleDateString() : 'Pending'}</strong>
                </div>
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition shadow-md">Pay Now</button>
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
               <p className="text-blue-500 text-sm mt-1">Review your application statuses in the history section below.</p>
            </div>
          )}

          {/* HISTORY SECTION: ALL APPLICATIONS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 font-bold text-gray-800 flex items-center gap-2 bg-gray-50">
              <FaHistory className="text-blue-500" /> 
              <span>Application History</span>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Syncing database...</div>
              ) : leases.length > 0 ? (
                leases.map(l => (
                  <div key={l.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-gray-800">{l.property_name || 'HomeHub Property'}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Application Date: {l.created_at ? new Date(l.created_at).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`flex items-center gap-2 text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
                        l.status?.toLowerCase() === 'active' ? 'bg-green-50 text-green-600 border-green-200' :
                        l.status?.toLowerCase() === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                        'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {l.status?.toLowerCase() === 'active' ? <FaCheckCircle /> : 
                         l.status?.toLowerCase() === 'pending' ? <FaHourglassHalf /> : 
                         <FaTimesCircle />} 
                        {l.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400 italic">
                  You haven't applied for any properties yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
          <FaTools className="mx-auto text-4xl text-gray-200 mb-4" />
          <h3 className="text-gray-800 font-bold">Maintenance Requests</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
            This section is only available for tenants with an active lease.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TenantDashboard;
