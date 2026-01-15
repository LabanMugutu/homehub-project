import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios';
import { 
  FaBell, FaCheck, FaTrash, FaTools, FaHome, FaInfoCircle, FaClock 
} from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/users/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 2. Actions
  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      await api.patch(`/users/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark read");
    }
  };

  const clearAll = async () => {
    if(!window.confirm("Clear all notifications?")) return;
    try {
      setNotifications([]);
      await api.delete('/users/notifications/clear');
    } catch (err) {
      console.error("Failed to clear");
    }
  };

  // 3. Helper: Get Icon based on message content
  const getIcon = (msg) => {
    const text = msg.toLowerCase();
    if (text.includes('maintenance') || text.includes('repair') || text.includes('fix')) {
      return <div className="bg-orange-100 p-3 rounded-full text-orange-600"><FaTools /></div>;
    }
    if (text.includes('lease') || text.includes('property') || text.includes('rent')) {
      return <div className="bg-blue-100 p-3 rounded-full text-blue-600"><FaHome /></div>;
    }
    if (text.includes('approved') || text.includes('success')) {
      return <div className="bg-green-100 p-3 rounded-full text-green-600"><FaCheck /></div>;
    }
    return <div className="bg-gray-100 p-3 rounded-full text-gray-600"><FaInfoCircle /></div>;
  };

  return (
    <DashboardLayout title="Notifications" role="tenant"> {/* Role prop is just for layout link highlighting */}
      
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Activity Feed</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.is_read).length} New
            </span>
          </div>
          
          {notifications.length > 0 && (
            <button 
              onClick={clearAll}
              className="text-gray-500 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition"
            >
              <FaTrash className="text-xs" /> Clear All
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`flex gap-4 p-5 rounded-xl border transition-all hover:shadow-md ${
                  notif.is_read 
                    ? 'bg-white border-gray-100' 
                    : 'bg-blue-50/50 border-blue-100 shadow-sm'
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notif.message)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className={`text-gray-800 mb-1 ${!notif.is_read ? 'font-bold' : 'font-medium'}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaClock /> {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action */}
                {!notif.is_read && (
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    className="self-center p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                    title="Mark as read"
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-400">All caught up!</h3>
            <p className="text-gray-400 text-sm">You have no new notifications.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;