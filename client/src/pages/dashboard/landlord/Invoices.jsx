import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import api from '../../../api/axios';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const LandlordInvoices = () => {
  const [leases, setLeases] = useState([]);
  const [formData, setFormData] = useState({ lease_id: '', amount: '', description: '', due_date: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/leases').then(res => setLeases(res.data || [])).catch(console.error);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/payments/invoices', formData);
      alert("Invoice Created!");
      setFormData({ lease_id: '', amount: '', description: '', due_date: '' });
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Invoice" role="landlord">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaFileInvoiceDollar className="text-blue-600" /> New Invoice
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <select 
            required className="w-full border rounded-lg p-3"
            value={formData.lease_id}
            onChange={e => setFormData({...formData, lease_id: e.target.value})}
          >
            <option value="">-- Select Tenant --</option>
            {leases.filter(l => l.status === 'active').map(l => (
              <option key={l.id} value={l.id}>{l.tenant_name} - {l.property_name}</option>
            ))}
          </select>
          <input 
            type="number" required placeholder="Amount (KSh)" className="w-full border rounded-lg p-3"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
          />
          <input 
            type="text" required placeholder="Description (e.g. Feb Rent)" className="w-full border rounded-lg p-3"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <input 
            type="date" required className="w-full border rounded-lg p-3"
            value={formData.due_date}
            onChange={e => setFormData({...formData, due_date: e.target.value})}
          />
          <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
            {loading ? 'Sending...' : 'Send Invoice'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default LandlordInvoices;