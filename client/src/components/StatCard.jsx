import React from 'react';
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 flex flex-col justify-between h-32 hover:shadow-md transition">
    <span className="text-gray-600 text-sm font-medium">{label}</span>
    <div className="flex justify-between items-end"><span className={`text-3xl font-bold ${color}`}>{value}</span><span className="text-2xl opacity-50">{icon}</span></div>
  </div>
);
export default StatCard;