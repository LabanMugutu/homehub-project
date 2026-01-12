import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaCheckCircle, FaTimesCircle, FaUserShield, FaSpinner, FaIdCard } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Users
  const fetchUsers = async () => {
    try {
      const res = await api.get('/users'); // We might need to create this route in backend if it doesn't exist
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Handle Approval Logic
  const handleVerify = async (userId, status) => {
    if(!window.confirm(`Are you sure you want to ${status} this user?`)) return;

    try {
      // Calls: PATCH /users/<id>/verify
      await api.patch(`/users/${userId}/verify`, { status });
      alert(`User ${status} successfully!`);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Verification failed", error);
      alert("Failed to update status.");
    }
  };

  return (
    <DashboardLayout title="Admin Overview" role="admin">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 text-sm font-bold uppercase">Total Users</h3>
           <p className="text-3xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 text-sm font-bold uppercase">Pending Verifications</h3>
           <p className="text-3xl font-bold text-orange-500">
             {users.filter(u => u.role === 'landlord' && u.status === 'pending').length}
           </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-gray-500 text-sm font-bold uppercase">Verified Landlords</h3>
           <p className="text-3xl font-bold text-green-600">
             {users.filter(u => u.role === 'landlord' && u.status === 'active').length}
           </p>
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <FaUserShield className="text-brand-blue" /> User Management
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500"><FaSpinner className="animate-spin inline mr-2"/> Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="px-6 py-3 font-bold">User</th>
                <th className="px-6 py-3 font-bold">Role</th>
                <th className="px-6 py-3 font-bold">ID Document</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'landlord' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.id_document ? (
                      <a href={user.id_document} target="_blank" rel="noopener noreferrer" className="text-brand-blue font-bold text-xs hover:underline flex items-center gap-1">
                        <FaIdCard /> View ID
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Not Uploaded</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="text-green-600 font-bold text-xs flex items-center gap-1"><FaCheckCircle/> Active</span>
                    ) : (
                       <span className="text-orange-500 font-bold text-xs flex items-center gap-1"><FaSpinner/> Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === 'landlord' && user.status !== 'active' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleVerify(user.id, 'active')}
                          className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200 transition" 
                          title="Approve"
                        >
                          <FaCheckCircle />
                        </button>
                        <button 
                          onClick={() => handleVerify(user.id, 'rejected')}
                          className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 transition"
                          title="Reject"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;