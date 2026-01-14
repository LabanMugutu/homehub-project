import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import api from '../../api/axios';
import { FaBuilding, FaUserFriends, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';

const LandlordOverview = () => {
  const [stats, setStats] = useState({ properties: 0, tenants: 0, revenue: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🟢 Fetching both properties and leases simultaneously
        const [propRes, leaseRes] = await Promise.all([
          api.get('/properties'),
          api.get('/leases')
        ]);

        console.log("Landlord Dashboard Data:", { properties: propRes.data, leases: leaseRes.data });

        // 🟢 THE FIX: Filter leases by 'active' status regardless of capitalization
        const activeLeases = leaseRes.data.filter(l => 
          l.status?.toLowerCase() === 'active'
        );

        // 🟢 Identify pending requests for the "Alerts" card
        const pendingRequests = leaseRes.data.filter(l => 
          l.status?.toLowerCase() === 'pending'
        ).length;

        // 🟢 Calculate revenue only from those active leases
        const totalRevenue = activeLeases.reduce((sum, l) => sum + (l.rent_amount || 0), 0);

        setStats({
          properties: propRes.data.length,
          tenants: activeLeases.length, // This will now update as John approves leases
          revenue: totalRevenue,
          alerts: pendingRequests
        });
      } catch (err) {
        console.error("Failed to sync landlord overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Overview">
      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Properties" 
          value={loading ? '...' : stats.properties} 
          icon={<FaBuilding />} 
          color="text-brand-blue" 
        />
        <StatCard 
          label="Active Tenants" 
          value={loading ? '...' : stats.tenants} 
          icon={<FaUserFriends />} 
          color="text-blue-500" 
        />
        <StatCard 
          label="Monthly Revenue" 
          value={loading ? '...' : `Ksh ${stats.revenue.toLocaleString()}`} 
          icon={<FaMoneyBillWave />} 
          color="text-green-600" 
        />
        <StatCard 
          label="Pending Requests" 
          value={loading ? '...' : stats.alerts} 
          icon={<FaExclamationTriangle />} 
          color="text-red-500" 
        />
      </div>

      {/* 🟢 Contextual Alert for Pending Actions */}
      {!loading && stats.alerts > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-amber-800">
            <FaExclamationTriangle className="text-xl" />
            <div>
              <p className="font-bold">Pending Applications</p>
              <p className="text-sm">You have {stats.alerts} lease requests waiting for your approval.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard/landlord/properties'} 
            className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-700 transition"
          >
            Review Now
          </button>
        </div>
      )}

      {/* 🟢 Empty State for New Landlords */}
      {!loading && stats.properties === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
          <FaBuilding className="mx-auto text-gray-300 text-5xl mb-4" />
          <h3 className="text-xl font-bold text-gray-800">Ready to list your first property?</h3>
          <p className="text-gray-500 mb-6">Add a property to start receiving lease applications.</p>
          <button className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold">
            Add Property
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LandlordOverview;