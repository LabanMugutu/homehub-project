import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  FaHome, FaBuilding, FaClipboardList, FaTools, 
  FaBell, FaCog, FaSignOutAlt, FaUserShield, FaUser
} from 'react-icons/fa';

const DashboardLayout = ({ children, title, role }) => {
  const navigate = useNavigate();
  // Get latest user data from storage
  const user = JSON.parse(localStorage.getItem('user')) || { role: 'tenant', full_name: 'User' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- 1. DEFINE LINKS PER ROLE (Strict Separation) ---
  const links = {
    admin: [
      { label: 'Admin Overview', path: '/admin', icon: <FaUserShield /> }, 
      { label: 'Notifications', path: '/dashboard/notifications', icon: <FaBell /> }, 
      { label: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    ],
    landlord: [
      { label: 'Overview', path: '/dashboard', icon: <FaHome /> },
      { label: 'My Properties', path: '/dashboard/landlord', icon: <FaBuilding /> }, 
      { label: 'Lease Requests', path: '/dashboard/landlord/requests', icon: <FaClipboardList /> }, 
      
      // 🟢 FIX: Point to the LANDLORD maintenance page
      { label: 'Maintenance', path: '/dashboard/landlord/maintenance', icon: <FaTools /> },
      
      { label: 'Notifications', path: '/dashboard/notifications', icon: <FaBell /> },
      { label: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    ],
    tenant: [
      { label: 'Overview', path: '/dashboard', icon: <FaHome /> },
      { label: 'My Applications', path: '/dashboard/applications', icon: <FaClipboardList /> },
      
      // Tenant keeps the original link
      { label: 'Maintenance', path: '/dashboard/maintenance', icon: <FaTools /> },
      
      { label: 'Notifications', path: '/dashboard/notifications', icon: <FaBell /> },
      { label: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    ]
  };

  // Select links based on the user's role
  const currentLinks = links[user.role] || links.tenant;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* --- SIDEBAR SECTION --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="text-xl font-extrabold text-brand-blue">HomeHub.</Link>
          <span className="ml-2 text-[10px] uppercase bg-blue-50 text-brand-blue px-2 py-0.5 rounded border border-blue-100 font-bold">
            {user.role}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {currentLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/dashboard' || link.path === '/admin'} 
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-brand-blue text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="bg-gray-200 p-2 rounded-full text-gray-500"><FaUser /></div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 w-full bg-white border border-gray-200 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-bold shadow-sm"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT SECTION --- */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your {user.role} activities</p>
          </div>
          
          <div className="flex gap-4">
            <Link to="/" className="text-sm font-bold text-brand-blue hover:underline">
              Go to Website &rarr;
            </Link>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;