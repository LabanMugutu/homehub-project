import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FaCheck, FaTimes, FaUserShield } from 'react-icons/fa';

const AdminDashboard = () => {
  const [pendingLandlords, setPendingLandlords] = useState([
    { id: 1, name: 'Jane Smith', email: 'jane@example.com', doc: 'ID_Front.jpg', date: '2024-01-04' }
  ]);
  const handleAction = (id, action) => {
    alert(`User has been ${action}ed.`);
    setPendingLandlords(pendingLandlords.filter(l => l.id !== id));
  };
  return (
    <DashboardLayout title="Trust & Verification Center">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8"><div className="flex"><FaUserShield className="text-amber-400 text-xl" /><div className="ml-3"><h3 className="text-sm font-bold text-amber-800">Verification Protocol</h3><p className="text-sm text-amber-700">Verify ID plausibility.</p></div></div></div>
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
            {pendingLandlords.map((landlord) => (
              <li key={landlord.id} className="px-6 py-4 flex justify-between">
                  <div><p className="font-bold">{landlord.name}</p><p className="text-sm text-gray-500">{landlord.email}</p></div>
                  <div className="flex gap-2"><button onClick={() => handleAction(landlord.id, 'Approve')} className="px-4 py-2 text-xs font-bold rounded text-white bg-green-600"><FaCheck /> Approve</button></div>
              </li>
            ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};
export default AdminDashboard;