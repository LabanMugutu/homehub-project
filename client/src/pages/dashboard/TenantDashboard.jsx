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
      .then(res => setLeases(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 🟢 FIND ACTIVE LEASE
  const activeLease = leases.find(l => l.status === 'active');

  return (
    <DashboardLayout title="Tenant Portal" role="tenant">
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('lease')} className={`pb-2 px-4 font-bold ${activeTab === 'lease' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
          <FaFileContract className="inline mr-2" /> My Lease & Applications
        </button>
        <button onClick={() => setActiveTab('maintenance')} className={`pb-2 px-4 font-bold ${activeTab === 'maintenance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
          <FaTools className="inline mr-2" /> Maintenance
        </button>
      </div>

      {activeTab === 'lease' && (
        <div className="space-y-8">
          {/* TOP SECTION: ACTIVE LEASE ONLY */}
          {activeLease ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-600 text-white rounded-xl p-8 shadow-lg">
                <h3 className="text-blue-100 uppercase text-xs font-bold mb-2">Rent Amount</h3>
                <div className="text-5xl font-bold mb-4">Ksh {activeLease.rent_amount.toLocaleString()}</div>
                <div className="flex items-center gap-2 mb-8 text-blue-50">
                  <FaCalendarCheck /> Move-in: <strong>{new Date(activeLease.start_date).toLocaleDateString()}</strong>
                </div>
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition">Pay Now</button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-gray-800 font-bold text-lg mb-6">Agreement Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Property</span>
                    <span className="font-bold">{activeLease.property_name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Expiry Date</span>
                    <span className="font-bold text-red-500">{new Date(activeLease.end_date).toLocaleDateString()}</span>
                  </div>
                  <span className="inline-block mt-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">ACTIVE LEASE</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
              No active lease found. Monitor your applications in the history section below.
            </div>
          )}

          {/* HISTORY SECTION: ALL APPLICATIONS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100 font-bold text-gray-800 flex items-center gap-2">
              <FaHistory /> Application History
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? <div className="p-6 text-center">Syncing...</div> : leases.map(l => (
                <div key={l.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-800">{l.property_name}</h4>
                    <p className="text-xs text-gray-400">Application Date: {new Date(l.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                    l.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' :
                    l.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {l.status === 'active' ? <FaCheckCircle /> : l.status === 'pending' ? <FaHourglassHalf /> : <FaTimesCircle />} {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TenantDashboard;
