import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout'; // ✅ Correct path (2 levels up)
import api from '../../api/axios'; // ✅ Correct path (2 levels up)
import { 
  FaHome, FaSearch, FaCalendarAlt, FaMoneyBillWave, 
  FaCheckCircle, FaClock, FaTimesCircle, FaMapMarkerAlt 
} from 'react-icons/fa';

const Applications = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <DashboardLayout title="My Applications" role="tenant">
      
      {/* 1. Header Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Applications</p>
            <h2 className="text-3xl font-bold text-gray-800">{leases.length}</h2>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <FaHome className="text-xl" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Pending Review</p>
            <h2 className="text-3xl font-bold text-yellow-600">
              {leases.filter(l => l.status?.toLowerCase() === 'pending').length}
            </h2>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-yellow-600">
            <FaClock className="text-xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Active Leases</p>
            <h2 className="text-3xl font-bold text-green-600">
              {leases.filter(l => l.status?.toLowerCase() === 'active').length}
            </h2>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-green-600">
            <FaCheckCircle className="text-xl" />
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 animate-pulse">Loading your application history...</p>
        </div>
      ) : leases.length > 0 ? (
        <div className="space-y-4">
          {leases.map((lease) => (
            <div 
              key={lease.id} 
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left: Icon & Info */}
                <div className="flex gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                    <FaHome className="text-2xl text-gray-400 group-hover:text-blue-500" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {lease.property_name || "Unknown Property"}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                      {lease.unit_number && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-600">
                          Unit: {lease.unit_number}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" /> 
                        Applied: {new Date(lease.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Rent */}
                <div className="flex flex-row md:flex-col justify-between items-end gap-2 min-w-[140px]">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 ${
                    lease.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' :
                    lease.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {lease.status?.toLowerCase() === 'active' ? <FaCheckCircle /> :
                     lease.status?.toLowerCase() === 'pending' ? <FaClock /> : <FaTimesCircle />}
                    {lease.status}
                  </span>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">Monthly Rent</p>
                    <p className="text-lg font-bold text-gray-900">
                      KSh {lease.rent_amount?.toLocaleString()}
                    </p>
                  </div>
                </div>

              </div>
              
              {/* Active Lease Actions */}
              {lease.status?.toLowerCase() === 'active' && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-4">
                  <a href="/dashboard/maintenance" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                    Report Issue
                  </a>
                  <button className="text-sm font-bold text-gray-600 hover:text-gray-800 transition">
                    View Lease Agreement
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // 3. Empty State
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaSearch className="text-3xl text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You haven't submitted any rental applications yet. Browse our marketplace to find your next home.
          </p>
          <a 
            href="/marketplace" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Browse Properties
          </a>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Applications;