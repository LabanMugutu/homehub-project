import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaHome, FaClipboardList, FaTools, FaBell } from 'react-icons/fa';

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ leases: 0, maintenance: 0, notifications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch REAL counts from backend
    const fetchData = async () => {
      try {
        const [leasesRes, maintRes, notifRes] = await Promise.all([
          api.get('/leases'),
          api.get('/maintenance'),
          api.get('/notifications/unread')
        ]);

        setStats({
          leases: leasesRes.data.length,
          maintenance: maintRes.data.length,
          notifications: notifRes.data.unread_count || 0
        });
      } catch (error) {
        console.error("Error fetching dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Overview" role={user.role}>
      {/* Welcome Section */}
      <div className="bg-brand-blue rounded-xl p-8 text-white mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user.full_name}!</h2>
        <p className="opacity-90">Here is what's happening with your properties today.</p>
      </div>

      {/* Stats Grid - POWERED BY REAL BACKEND DATA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Leases/Applications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase mb-1">
                {user.role === 'landlord' ? 'Active Leases' : 'My Applications'}
              </p>
              <h3 className="text-4xl font-extrabold text-gray-800">{loading ? '-' : stats.leases}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-brand-blue">
              <FaClipboardList size={24} />
            </div>
          </div>
        </div>

        {/* Card 2: Maintenance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase mb-1">Maintenance Requests</p>
              <h3 className="text-4xl font-extrabold text-gray-800">{loading ? '-' : stats.maintenance}</h3>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-orange-500">
              <FaTools size={24} />
            </div>
          </div>
        </div>

        {/* Card 3: Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase mb-1">Unread Alerts</p>
              <h3 className="text-4xl font-extrabold text-gray-800">{loading ? '-' : stats.notifications}</h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-purple-500">
              <FaBell size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* Empty State / Call to Action */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Actions</h3>
        <div className="flex justify-center gap-4 mt-4">
            {user.role === 'landlord' ? (
                <a href="/dashboard/landlord/add" className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-900">
                    Add Property
                </a>
            ) : (
                <a href="/marketplace" className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-900">
                    Browse Homes
                </a>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;