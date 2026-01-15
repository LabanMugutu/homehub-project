import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaTools, FaPlus, FaClock } from 'react-icons/fa';

const Maintenance = () => {
  const [requests, setRequests] = useState([]); // 👈 Starts Empty! No dummy data.
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({ title: '', description: '', unit_id: '' });

  // FETCH REAL DATA
  const fetchRequests = async () => {
    try {
      const res = await api.get('/maintenance');
      setRequests(res.data);
    } catch (error) {
      console.error("Error loading maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // SUBMIT REAL DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/maintenance', formData);
      setShowModal(false);
      fetchRequests();
      alert("Request Submitted!");
    } catch (error) {
      alert("Failed. Ensure you have an active lease.");
    }
  };

  return (
    <DashboardLayout title="Maintenance" role={user.role}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Maintenance Requests</h2>
        {user.role === 'tenant' && (
          <button onClick={() => setShowModal(true)} className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaPlus /> New Request
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No maintenance requests found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map(req => (
              <div key={req.id} className="p-6 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 h-fit"><FaTools /></div>
                  <div>
                    <h3 className="font-bold text-gray-800">{req.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{req.description}</p>
                    <div className="mt-2 text-xs text-gray-400">Status: {req.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Report Issue</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Unit ID" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, unit_id: e.target.value})} required />
              <input type="text" placeholder="Title" className="w-full border p-2 rounded" onChange={e => setFormData({...formData, title: e.target.value})} required />
              <textarea placeholder="Description" className="w-full border p-2 rounded h-24" onChange={e => setFormData({...formData, description: e.target.value})} required />
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                <button className="px-4 py-2 bg-brand-blue text-white rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Maintenance;
