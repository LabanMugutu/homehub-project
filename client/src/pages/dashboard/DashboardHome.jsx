import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { 
  FaWallet, FaHome, FaTools, FaUserFriends, 
  FaCheckCircle, FaExclamationCircle, FaChartLine 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [stats, setStats] = useState({
    revenue: 0,
    totalProperties: 0,
    occupancy: 0,
    pendingActions: 0,
    activeLease: null,
    openMaintenance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // 🟢 LANDLORD DATA FETCHING
        if (user.role === 'landlord') {
          const [propRes, leaseRes, maintRes] = await Promise.all([
            api.get('/properties'),
            api.get('/leases'), // You might need a specific endpoint for ALL leases if you are admin, but landlords usually see their own via filtering
            api.get('/maintenance')
          ]);

          const properties = propRes.data || [];
          const leases = leaseRes.data || []; // Assuming backend filters for landlord
          const maintenance = maintRes.data || [];

          // Calculate Revenue (Sum of rent from ACTIVE leases)
          const activeLeases = leases.filter(l => l.status === 'active');
          const revenue = activeLeases.reduce((sum, l) => sum + (l.rent_amount || 0), 0);
          
          // Calculate Pending Actions
          const pendingLeases = leases.filter(l => l.status === 'pending').length;
          const openMaintenance = maintenance.filter(m => m.status !== 'completed').length;

          setStats({
            revenue,
            totalProperties: properties.length,
            occupancy: activeLeases.length,
            pendingActions: pendingLeases + openMaintenance
          });
        } 
        
        // 🟢 TENANT DATA FETCHING
        else {
          const [leaseRes, maintRes] = await Promise.all([
            api.get('/leases'),
            api.get('/maintenance')
          ]);

          const leases = Array.isArray(leaseRes.data) ? leaseRes.data : leaseRes.data.leases || [];
          const maintenance = maintRes.data || [];

          const activeLease = leases.find(l => l.status === 'active');
          const openIssues = maintenance.filter(m => m.status !== 'completed').length;

          setStats({
            activeLease,
            openMaintenance: openIssues
          });
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.role]);

  // --- RENDER SKELETON LOADING ---
  if (loading) return (
    <DashboardLayout title="Overview" role={user.role}>
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title={`Welcome back, ${user.full_name?.split(' ')[0]}!`} role={user.role}>
      
      {/* ================= LANDLORD VIEW ================= */}
      {user.role === 'landlord' && (
        <div className="space-y-8">
          {/* 1. Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Revenue Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Est. Monthly Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">KSh {stats.revenue.toLocaleString()}</h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-green-600">
                <FaWallet className="text-xl" />
              </div>
            </div>

            {/* Occupancy Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Active Tenants</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.occupancy}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <FaUserFriends className="text-xl" />
              </div>
            </div>

            {/* Properties Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase">Total Properties</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalProperties}</h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                <FaHome className="text-xl" />
              </div>
            </div>

            {/* Actions Card (Red if attention needed) */}
            <div className={`p-6 rounded-xl border shadow-sm flex items-center justify-between ${
              stats.pendingActions > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'
            }`}>
              <div>
                <p className={`text-xs font-bold uppercase ${stats.pendingActions > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  Action Needed
                </p>
                <h3 className={`text-2xl font-bold ${stats.pendingActions > 0 ? 'text-red-700' : 'text-gray-800'}`}>
                  {stats.pendingActions}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stats.pendingActions > 0 ? 'bg-red-200 text-red-700' : 'bg-gray-50 text-gray-400'}`}>
                <FaExclamationCircle className="text-xl" />
              </div>
            </div>
          </div>

          {/* 2. Quick Actions */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/dashboard/landlord/requests" className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition group">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  <FaCheckCircle />
                </div>
                <span className="font-medium text-gray-700">Review Lease Applications</span>
              </Link>
              <Link to="/dashboard/landlord/maintenance" className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition group">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
                  <FaTools />
                </div>
                <span className="font-medium text-gray-700">Manage Maintenance</span>
              </Link>
              <Link to="/dashboard/landlord/add" className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition group">
                <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                  <FaHome />
                </div>
                <span className="font-medium text-gray-700">List New Property</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= TENANT VIEW ================= */}
      {user.role === 'tenant' && (
        <div className="space-y-8">
          {/* 1. Current Home Status */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-blue-100 font-medium mb-1">Current Residence</p>
                <h2 className="text-3xl font-bold">
                  {stats.activeLease ? stats.activeLease.property_name : "No Active Lease"}
                </h2>
                {stats.activeLease && (
                  <p className="text-blue-200 mt-2 flex items-center gap-2">
                    <FaHome /> Unit {stats.activeLease.unit_number} • Rent: KSh {stats.activeLease.rent_amount.toLocaleString()}/mo
                  </p>
                )}
              </div>
              
              {stats.activeLease ? (
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 min-w-[200px]">
                  <p className="text-xs text-blue-100 uppercase font-bold mb-1">Lease Status</p>
                  <div className="flex items-center gap-2 text-green-300 font-bold text-lg">
                    <FaCheckCircle /> Active
                  </div>
                </div>
              ) : (
                <Link to="/marketplace" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
                  Browse Properties
                </Link>
              )}
            </div>
          </div>

          {/* 2. Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Maintenance Status */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">Maintenance Requests</h3>
                  <p className="text-gray-500 text-sm">Issues currently being resolved</p>
                </div>
                <div className={`p-3 rounded-lg ${stats.openMaintenance > 0 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                  <FaTools className="text-xl" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-gray-800">{stats.openMaintenance}</span>
                <span className="text-gray-500 mb-1">open issues</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/dashboard/maintenance" className="text-blue-600 font-bold text-sm hover:underline">
                  Report a new issue &rarr;
                </Link>
              </div>
            </div>

            {/* Application Status (If no active lease) */}
            {!stats.activeLease && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">Applications</h3>
                    <p className="text-gray-500 text-sm">Track your pending approvals</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                    <FaChartLine className="text-xl" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link to="/dashboard/applications" className="text-blue-600 font-bold text-sm hover:underline">
                    View application history &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default DashboardHome;