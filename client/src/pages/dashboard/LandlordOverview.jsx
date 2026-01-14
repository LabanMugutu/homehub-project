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
        const [propRes, leaseRes] = await Promise.all([
          api.get('/properties'),
          api.get('/leases')
        ]);

        // 🟢 CALCULATIONS BASED ON DATABASE DATA
        const activeLeases = leaseRes.data.filter(l => l.status === 'active');
        const totalRevenue = activeLeases.reduce((sum, l) => sum + (l.rent_amount || 0), 0);
        const pendingCount = leaseRes.data.filter(l => l.status === 'pending').length;

        setStats({
          properties: propRes.data.length,
          tenants: activeLeases.length, 
          revenue: totalRevenue,
          alerts: pendingCount
        });
      } catch (err) {
        console.error("Dashboard failed to sync:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Properties" value={loading ? '...' : stats.properties} icon={<FaBuilding />} color="text-blue-600" />
        <StatCard label="Active Tenants" value={loading ? '...' : stats.tenants} icon={<FaUserFriends />} color="text-blue-400" />
        <StatCard label="Monthly Revenue" value={loading ? '...' : `Ksh ${stats.revenue.toLocaleString()}`} icon={<FaMoneyBillWave />} color="text-green-500" />
        <StatCard label="Pending Tasks" value={loading ? '...' : stats.alerts} icon={<FaExclamationTriangle />} color="text-red-500" />
      </div>
      
      {/* 🟢 Add a message if there are pending alerts */}
      {stats.alerts > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-orange-700 font-medium">
          You have {stats.alerts} new lease applications waiting for review.
        </div>
      )}
    </DashboardLayout>
  );
};

export default LandlordOverview;