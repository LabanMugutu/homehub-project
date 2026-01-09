import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FaFileContract, FaCalendarCheck, FaTools, FaHistory } from 'react-icons/fa';

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState('lease'); // 'lease' or 'maintenance'

  // Mock Lease Data
  const lease = {
    property: "Sunset Apartments, Unit 4B",
    landlord: "John Doe",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    rentAmount: 45000,
    nextDue: "2024-02-05",
    status: "Active",
    document: "lease_signed.pdf"
  };

  // Mock Maintenance History
  const maintenanceHistory = [
    { id: 1, title: "Leaking Sink", date: "2024-01-10", status: "Resolved" },
    { id: 2, title: "Broken Window", date: "2024-01-15", status: "Pending" }
  ];

  return (
    <DashboardLayout title="Tenant Portal" role="tenant">
      
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('lease')}
          className={`pb-2 px-4 font-bold ${activeTab === 'lease' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}
        >
          <FaFileContract className="inline mr-2" /> Lease Agreement
        </button>
        <button 
          onClick={() => setActiveTab('maintenance')}
          className={`pb-2 px-4 font-bold ${activeTab === 'maintenance' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}
        >
          <FaTools className="inline mr-2" /> Maintenance
        </button>
      </div>

      {/* --- LEASE TAB --- */}
      {activeTab === 'lease' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Rent Card */}
          <div className="bg-gradient-to-br from-brand-blue to-blue-900 text-white rounded-xl p-8 shadow-lg">
            <h3 className="text-blue-200 uppercase text-xs font-bold mb-2">Next Rent Due</h3>
            <div className="text-5xl font-bold mb-4">Ksh {lease.rentAmount.toLocaleString()}</div>
            <div className="flex items-center gap-2 mb-8 text-blue-100">
              <FaCalendarCheck /> Due Date: <span className="font-bold text-white">{lease.nextDue}</span>
            </div>
            <button className="w-full bg-white text-brand-blue font-bold py-3 rounded-lg hover:bg-gray-100 transition">
              Pay Rent Now
            </button>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-gray-800 font-bold text-lg mb-6">Agreement Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Property</span>
                <span className="font-medium text-gray-800">{lease.property}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Landlord</span>
                <span className="font-medium text-gray-800">{lease.landlord}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Lease Period</span>
                <span className="font-medium text-gray-800">{lease.startDate} to {lease.endDate}</span>
              </div>
              <div className="mt-6 pt-4">
                <button className="text-brand-blue font-bold text-sm hover:underline">
                  Download Signed Lease (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAINTENANCE TAB --- */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Report an Issue</h3>
          <form className="mb-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <input type="text" placeholder="Issue Title (e.g. No Hot Water)" className="border p-3 rounded" />
               <select className="border p-3 rounded">
                 <option>Low Priority</option>
                 <option>Medium Priority</option>
                 <option>High Priority (Emergency)</option>
               </select>
             </div>
             <textarea placeholder="Describe the issue..." className="w-full border p-3 rounded h-24 mb-4"></textarea>
             <button className="bg-gray-800 text-white px-6 py-2 rounded font-bold">Submit Request</button>
          </form>

          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FaHistory /> Request History</h3>
          <ul className="space-y-3">
            {maintenanceHistory.map(item => (
              <li key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-100">
                <span className="font-medium text-gray-700">{item.title}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{item.date}</span>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${item.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </DashboardLayout>
  );
};

export default TenantDashboard;
