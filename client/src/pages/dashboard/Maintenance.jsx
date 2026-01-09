import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FaTools, FaCheckCircle, FaClock } from 'react-icons/fa';

const Maintenance = () => {
  const [requests, setRequests] = useState([
    { id: 1, title: "Leaking Faucet", description: "Kitchen sink tap dripping", priority: "medium", status: "pending", date: "2024-01-05" }
  ]);
  return (
    <DashboardLayout title="Maintenance Alerts">
      <div className="grid gap-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center min-w-[60px]">
               <div className="bg-blue-50 p-3 rounded-full mb-2"><FaTools className="text-brand-blue" /></div>
               <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-yellow-100 text-yellow-800">{req.priority}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between"><h3 className="text-lg font-bold text-gray-800">{req.title}</h3><span className="text-xs text-gray-500">{req.date}</span></div>
              <p className="text-gray-600 mt-1 text-sm">{req.description}</p>
            </div>
            <div className="flex flex-col justify-center min-w-[150px]">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded px-2 py-2 text-sm"><option>Pending</option><option>In Progress</option><option>Resolved</option></select>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Maintenance; // <--- THIS LINE IS REQUIRED
