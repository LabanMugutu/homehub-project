import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaHome, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const MyApplications = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugData, setDebugData] = useState(null); // 🟢 Store raw data for debugging

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        console.log("🚀 Fetching leases...");
        const res = await api.get('/leases');
        
        console.log("🔥 RAW API RESPONSE:", res);
        setDebugData(res.data); // Capture raw data for the black box

        // 🟢 SAFETY CHECK: Handle different data structures
        // If backend sends [ ... ], use it directly.
        // If backend sends { leases: [ ... ] }, extract it.
        if (Array.isArray(res.data)) {
          setLeases(res.data);
        } else if (res.data && Array.isArray(res.data.leases)) {
          setLeases(res.data.leases);
        } else if (res.data && Array.isArray(res.data.data)) {
          setLeases(res.data.data); // Some Flask setups do this
        } else {
          console.error("❌ UNEXPECTED DATA FORMAT:", res.data);
          setLeases([]);
        }

      } catch (err) {
        console.error("❌ FETCH ERROR:", err);
        setDebugData({ error: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FaSpinner className="animate-spin text-3xl mb-4 text-blue-600" />
        <p>Syncing with database...</p>
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
      </div>

      {/* 🔴 X-RAY DEBUG BOX: REMOVE THIS ONCE FIXED */}
      <div className="bg-black text-green-400 p-6 rounded-xl font-mono text-xs overflow-auto max-h-64 shadow-2xl border-2 border-green-500">
        <h3 className="text-white font-bold text-lg mb-2 border-b border-gray-700 pb-2 flex items-center gap-2">
           <FaExclamationTriangle className="text-yellow-500"/> DIAGNOSTIC PANEL
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
           <div>
              <strong>Items in State:</strong> <span className="text-white">{leases.length}</span>
           </div>
           <div>
              <strong>Data Type:</strong> <span className="text-white">{Array.isArray(leases) ? "Array (Correct)" : "Object (Wrong)"}</span>
           </div>
        </div>
        <strong>Raw Backend Response:</strong>
        <pre className="mt-2 text-gray-300 whitespace-pre-wrap">
          {JSON.stringify(debugData, null, 2)}
        </pre>
      </div>
      {/* ------------------------------------------- */}

      {leases.length > 0 ? (
        <div className="grid gap-6">
          {leases.map((lease) => (
            <div key={lease.id || Math.random()} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <FaHome className="text-xl" />
                  </div>
                  <div>
                    {/* Safe Access to properties */}
                    <h3 className="font-bold text-lg text-gray-800">{lease.property_name || "Unknown Property"}</h3>
                    <p className="text-sm text-gray-500">
                        Applied: {lease.created_at ? new Date(lease.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">ID: {lease.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      lease.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' :
                      lease.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {lease.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <FaHome className="mx-auto text-gray-300 text-5xl mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No Applications Visible</h3>
          <p className="text-gray-500 mb-6">Check the black box above to see why.</p>
          <a href="/marketplace" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Apply for a Home
          </a>
        </div>
      )}
    </div>
  );
};

export default MyApplications;