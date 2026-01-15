import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaMobileAlt, FaCheckCircle } from 'react-icons/fa';

const TenantBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    api.get('/payments/my-invoices')
      .then(res => setInvoices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (invoiceId) => {
    const phone = prompt("Enter M-Pesa Number (07...):");
    if (!phone) return;

    setPayingId(invoiceId);
    try {
      await api.post('/payments/pay', { invoice_id: invoiceId, phone_number: phone });
      alert(`STK Push sent to ${phone}. Check your phone!`);
    } catch (err) {
      alert("Payment failed: " + (err.response?.data?.error || err.message));
    } finally {
      setPayingId(null);
    }
  };

  return (
    <DashboardLayout title="Billing & Payments" role="tenant">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaMobileAlt className="text-green-600" /> My Invoices
        </h2>
        
        {loading ? <p>Loading...</p> : invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-bold text-lg">{inv.description}</p>
                  <p className="text-sm text-gray-500">Due: {inv.due_date}</p>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{inv.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold mb-2">KSh {inv.amount.toLocaleString()}</p>
                  {inv.status !== 'paid' && (
                    <button 
                      onClick={() => handlePay(inv.id)}
                      disabled={payingId === inv.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      {payingId === inv.id ? 'Sending...' : 'Pay with M-Pesa'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500">No outstanding invoices.</p>}
      </div>
    </DashboardLayout>
  );
};

export default TenantBilling;