import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { FaBuilding, FaUserFriends, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';

const LandlordOverview = () => {
  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Properties" value="56" icon={<FaBuilding />} color="text-brand-blue" />
        <StatCard label="Tenants" value="556" icon={<FaUserFriends />} color="text-blue-400" />
        <StatCard label="Revenue" value="Ksh 700k" icon={<FaMoneyBillWave />} color="text-green-500" />
        <StatCard label="Alerts" value="5" icon={<FaExclamationTriangle />} color="text-red-500" />
      </div>
    </DashboardLayout>
  );
};
export default LandlordOverview;