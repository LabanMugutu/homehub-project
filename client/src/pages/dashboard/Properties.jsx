import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FaMapMarkerAlt, FaPlus, FaMoneyBillWave, FaTools, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';

const Properties = () => {
  // Mock Data: Properties with Income and Maintenance Issues included
  const [properties] = useState([
    {
      id: 1,
      title: "Sunshine Apartments",
      location: "Kilimani, Nairobi",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
      earnings: 135000, // Total earnings for this property
      issues: [
        { id: 101, title: "Broken Gate Lock", status: "Pending" },
        { id: 102, title: "Leaking Roof", status: "Fixed" }
      ]
    },
    {
      id: 2,
      title: "Green Valley Estate",
      location: "Westlands, Nairobi",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      earnings: 85000,
      issues: [
        { id: 201, title: "No Water Pressure", status: "In Progress" }
      ]
    }
  ]);

  // Helper function to color-code status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-red-100 text-red-600';
      case 'In Progress': return 'bg-yellow-100 text-yellow-600';
      case 'Fixed': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <FaExclamationCircle />;
      case 'In Progress': return <FaClock />;
      case 'Fixed': return <FaCheckCircle />;
      default: return null;
    }
  };

  return (
    <DashboardLayout title="My Properties">
      
      {/* Header Action */}
      <div className="flex justify-end mb-6">
        <button className="bg-brand-blue text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-900 transition shadow-sm">
          <FaPlus /> Add New Property
        </button>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
            
            {/* 1. Property Header (Image & Income) */}
            <div className="flex h-40">
              <img src={prop.image} alt={prop.title} className="w-1/3 object-cover" />
              <div className="w-2/3 p-5 flex flex-col justify-between bg-gray-50">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{prop.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <FaMapMarkerAlt /> {prop.location}
                  </p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase">Monthly Earnings</p>
                   <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                     <FaMoneyBillWave /> Ksh {prop.earnings.toLocaleString()}
                   </p>
                </div>
              </div>
            </div>

            {/* 2. Maintenance Status Section */}
            <div className="p-5 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaTools className="text-gray-400" /> Maintenance Status
              </h4>
              
              {prop.issues.length > 0 ? (
                <div className="space-y-2">
                  {prop.issues.map((issue) => (
                    <div key={issue.id} className="flex justify-between items-center text-sm p-2 rounded bg-gray-50 border border-gray-100">
                      <span className="text-gray-700 font-medium">{issue.title}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)} {issue.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No active issues reported.</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
               <button className="text-brand-blue text-sm font-bold hover:underline">View Full Details</button>
            </div>

          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Properties;