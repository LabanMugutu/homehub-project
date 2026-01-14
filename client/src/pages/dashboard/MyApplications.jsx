import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaHome, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const MyApplications = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🟢 FETCH DATA: Hits the 'get_all_leases' route we fixed
    api.get('/leases')
      .then(res => {
        console.log("My Applications Data:", res.data); // Debug log
        setLeases(res.data);
      })
      .catch(err => console.error("Error fetching applications:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FaSpinner className="animate-spin text-3xl mb-4 text-blue-600" />
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
          <p className="text-gray-500">Track the status of your rental requests</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">
          Total: {leases.length}
        </div>
      </div>

      {leases.length > 0 ? (
        <div className="grid gap-6">
          {leases.map((lease) => (
            <div key={lease.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                
                {/* Property Info */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <FaHome className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{lease.property_name || "Property Name Loading..."}</h3>
                    <p className="text-sm text-gray-500">Application Date: {new Date(lease.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Ref ID: {lease.id.slice(0, 8)}...</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      lease.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' :
                      lease.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {lease.status?.toLowerCase() === 'active' ? <FaCheckCircle /> :
                       lease.status?.toLowerCase() === 'pending' ? <FaClock /> : <FaTimesCircle />}
                      {lease.status}
                    </span>
                  </div>
                  
                  {/* Rent Info */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rent</p>
                    <p className="font-bold text-gray-800">KSh {lease.rent_amount?.toLocaleString()}</p>
                  </div>
                </div>

              </div>
              
              {/* Active Lease Details (Only if active) */}
              {lease.status?.toLowerCase() === 'active' && (
                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4 text-sm bg-gray-50/50 p-4 rounded-lg">
                  <div>
                    <span className="text-gray-500 block">Move-in Date</span>
                    <span className="font-bold text-gray-800">{new Date(lease.start_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Expiry Date</span>
                    <span className="font-bold text-red-500">{new Date(lease.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <FaHome className="mx-auto text-gray-300 text-5xl mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Applications Found</h3>
          <p className="text-gray-500 mb-6">You haven't applied for any properties yet.</p>
          <a href="/marketplace" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Browse Properties
          </a>
        </div>
      )}
    </div>
  );
};

export default MyApplications;