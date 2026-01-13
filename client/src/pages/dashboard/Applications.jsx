import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const Applications = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const res = await api.get('/leases/my-leases');
        setLeases(res.data);
      } catch (error) {
        console.error("Failed to load leases");
      } finally {
        setLoading(false);
      }
    };
    fetchLeases();
  }, []);

  return (
    <DashboardLayout title="My Applications" role="tenant">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading applications...</div>
        ) : leases.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Applications Yet</h3>
            <p className="text-gray-500 mb-6">You haven't applied for any homes yet.</p>
            <Link to="/marketplace" className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition">
              Find a Home
            </Link>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Rent</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leases.map(lease => (
                <tr key={lease.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{lease.property_title}</p>
                    <p className="text-xs text-gray-500">{lease.property_city}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-600">
                    KES {lease.monthly_rent?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${lease.status === 'active' ? 'bg-green-100 text-green-700' : 
                        lease.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {lease.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(lease.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;