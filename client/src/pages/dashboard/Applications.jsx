import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const Applications = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugData, setDebugData] = useState(null);

  useEffect(() => {
    // 🟢 FORCE FETCH
    api.get('/leases')
      .then(res => {
        console.log("🔥 DEBUG DATA RECEIVED:", res.data);
        setDebugData(res.data);
        
        // Handle array vs object responses
        if (Array.isArray(res.data)) {
          setLeases(res.data);
        } else if (res.data && Array.isArray(res.data.leases)) {
          setLeases(res.data.leases);
        } else {
          setLeases([]); 
        }
      })
      .catch(err => {
        console.error("🔥 FETCH ERROR:", err);
        setDebugData({ error: err.message });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-8">Application Debugger</h1>

      {/* 🔴 THE FLOATING BLACK BOX (Z-Index 50 ensures it's on top) */}
      <div className="fixed top-24 right-10 z-50 bg-black text-green-400 p-6 rounded-xl shadow-2xl border-4 border-red-500 w-96 font-mono text-xs">
        <h2 className="text-white text-lg font-bold border-b border-gray-600 mb-2 pb-2 flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" /> DIAGNOSTIC PANEL
        </h2>
        <div className="space-y-2">
          <p><strong className="text-white">Status:</strong> {loading ? "Loading..." : "Finished"}</p>
          <p><strong className="text-white">Items Found:</strong> {leases.length}</p>
          <p><strong className="text-white">Raw Data Dump:</strong></p>
          <pre className="bg-gray-900 p-2 rounded overflow-auto max-h-40 text-gray-300">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>
      </div>
      {/* ------------------------------------------------------- */}

      {loading ? (
        <div className="flex items-center gap-2 text-xl text-gray-500">
          <FaSpinner className="animate-spin" /> Loading...
        </div>
      ) : (
        <div className="space-y-4">
          {leases.length === 0 ? (
            <div className="p-10 bg-white border-2 border-dashed border-gray-300 rounded-xl text-center">
              <h3 className="text-xl font-bold text-gray-400">Result: 0 Items</h3>
              <p className="text-gray-500">The backend returned an empty list.</p>
            </div>
          ) : (
            leases.map(l => (
              <div key={l.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-lg">{l.property_name || "Unknown Property"}</h3>
                <p>Status: {l.status}</p>
                <p className="text-xs text-gray-400">ID: {l.id}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;