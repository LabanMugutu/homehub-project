import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTrash } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Fetch REAL Data from Backend
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 2. Mark as Read
  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      // Update UI instantly
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error("Error updating notification");
    }
  };

  // 3. Delete Notification
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this alert?")) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification");
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'alert': return <FaExclamationCircle className="text-orange-500 text-xl" />;
      default: return <FaInfoCircle className="text-brand-blue text-xl" />;
    }
  };

  return (
    <DashboardLayout title="Notifications" role={user.role}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FaBell className="text-gray-400" /> Your Activity
          </h2>
          <button onClick={fetchNotifications} className="text-xs text-brand-blue hover:underline">
            Refresh
          </button>
        </div>

        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading alerts...</div>
        ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No new notifications found.</p>
              <p className="text-xs text-gray-400 mt-2">Real-time alerts will appear here.</p>
            </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((note) => (
              <div 
                key={note.id} 
                onClick={() => !note.is_read && handleMarkRead(note.id)}
                className={`p-6 flex gap-4 transition cursor-pointer ${note.is_read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="mt-1 flex-shrink-0">{getIcon(note.type)}</div>
                <div className="flex-1">
                  <p className={`text-gray-800 text-sm md:text-base ${!note.is_read ? 'font-bold' : ''}`}>
                    {note.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(note.created_at).toLocaleDateString()} • {new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;