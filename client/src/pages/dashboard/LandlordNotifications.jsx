import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FaBell, FaCheckCircle, FaUserShield, FaMoneyBillWave } from 'react-icons/fa';

const LandlordNotifications = () => {
  const [notifications] = useState([
    { 
      id: 1, 
      type: 'rent', 
      title: "Rent Payment Received", 
      message: "Tenant John Doe paid Ksh 45,000 for Sunset Apts Unit 4B.", 
      date: "10 mins ago" 
    },
    { 
      id: 2, 
      type: 'admin', 
      title: "Property Verified", 
      message: "Admin has approved your listing for 'Green Valley Estate'. It is now visible to tenants.", 
      date: "2 hours ago" 
    },
    { 
      id: 3, 
      type: 'admin', 
      title: "Document Update Required", 
      message: "Please re-upload a clearer copy of your ID for verification.", 
      date: "1 day ago" 
    }
  ]);

  return (
    <DashboardLayout title="Notifications Center">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="bg-brand-blue text-white p-3 rounded-full"><FaBell /></div>
          <div>
            <h2 className="font-bold text-gray-800">Alerts & Messages</h2>
            <p className="text-sm text-gray-600">Stay updated on admin requests and payments.</p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-4 hover:shadow-md transition">
              
              {/* Icon Logic */}
              <div className={`mt-1 text-2xl flex-shrink-0 
                ${notif.type === 'admin' ? 'text-blue-500' : 'text-green-500'}`}>
                 {notif.type === 'admin' ? <FaUserShield /> : <FaMoneyBillWave />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800">{notif.title}</h3>
                  <span className="text-xs text-gray-400 font-medium">{notif.date}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{notif.message}</p>
                
                {/* Optional Action Button for Admin types */}
                {notif.type === 'admin' && (
                  <button className="mt-3 text-xs font-bold text-brand-blue border border-blue-200 px-3 py-1 rounded hover:bg-blue-50">
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default LandlordNotifications;