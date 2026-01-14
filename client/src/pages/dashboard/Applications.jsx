import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FaHome, FaClock, FaCheckCircle, FaTimesCircle, 
  FaSpinner, FaSearch, FaMapMarkerAlt, FaMoneyBillWave 
} from 'react-icons/fa';

const Applications = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🟢 FETCH DATA
    api.get('/leases')
      .then(res => {
        // Robust handling for different data shapes
        if (Array.isArray(res.data)) {
          setLeases(res.data);
        } else if (res.data && Array.isArray(res.data.leases)) {
          setLeases(res.data.leases);
        } else {
          setLeases([]); 
        }
      })
      .catch(err => console.error("Error loading applications:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <FaSpinner className="animate-spin text-4xl mb-4 text-blue-600" />
        <p className="font-medium animate-pulse">Syncing your applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Applications</h1>
          <p className="text-gray-500 mt-2">Track and manage your rental requests in real-time.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-sm font-bold shadow-sm border border-blue-100">
          {leases.length} {leases.length === 1 ? 'Active Application' : 'Total Applications'}
        </div>
      </div>

      {/* Applications Grid */}
      {leases.length > 0 ? (
        <div className="grid gap-6">
          {leases.map((lease) => (
            <div 
              key={lease.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left: Property Info */}
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                    <FaHome className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {lease.property_name || "Unknown Property"}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <FaClock className="text-gray-400" /> 
                        Applied: {lease.created_at ? new Date(lease.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md font-mono text-xs text-gray-400">
                        ID: {lease.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Action */}
                <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  
                  {/* Status Badge */}
                  <div className="flex justify-between w-full md:w-auto md:flex-col md:items-end">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 hidden md:block">Current Status</span>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${
                      lease.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                      lease.status?.toLowerCase() === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                      'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {lease.status?.toLowerCase() === 'active' ? <FaCheckCircle /> :
                       lease.status?.toLowerCase() === 'pending' ? <FaClock /> : <FaTimesCircle />}
                      {lease.status}
                    </span>
                  </div>
                  
                  {/* Rent Amount */}
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <div className="bg-white p-1.5 rounded-full text-green-600 shadow-sm">
                      <FaMoneyBillWave />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Monthly Rent</p>
                      <p className="font-bold text-gray-800">KSh {lease.rent_amount?.toLocaleString()}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Polished Empty State
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <div className="bg-blue-50 p-6 rounded-full mb-6">
            <FaSearch className="text-blue-300 text-5xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Applications Found</h3>
          <p className="text-gray-500 mb-8 max-w-sm">
            It looks like you haven't applied for any homes yet. Explore our marketplace to find your perfect place.
          </p>
          <a 
            href="/marketplace" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse Properties
          </a>
        </div>
      )}
    </div>
  );
};

export default Applications;