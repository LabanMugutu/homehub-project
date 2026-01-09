import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaBell, FaUser, FaChartPie, FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = ({ children, title, role = 'landlord' }) => {
  const navigate = useNavigate();
  
  // 1. Landlord Menu
  const landlordMenu = [
    { name: 'Dashboard', icon: <FaChartPie />, path: '/landlord/dashboard' },
    { name: 'My Properties', icon: <FaBuilding />, path: '/landlord/properties' },
    { name: 'Notifications', icon: <FaBell />, path: '/landlord/notifications' },
    { name: 'Profile', icon: <FaUser />, path: '/landlord/profile' },
  ];

  // 2. Tenant Menu
  const tenantMenu = [
    { name: 'My Dashboard', icon: <FaHome />, path: '/tenant/dashboard' },
    { name: 'Find Property', icon: <FaBuilding />, path: '/marketplace' },
    { name: 'Profile', icon: <FaUser />, path: '/landlord/profile' },
  ];

  // Select menu based on role
  const menuItems = role === 'tenant' ? tenantMenu : landlordMenu;

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    // 1. Remove the token from storage
    localStorage.removeItem('token');
    
    // 2. Alert user (Optional)
    // alert("You have been signed out.");

    // 3. Redirect to Login Page
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-brand-blue text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-bold">🏠 HomeHub</h1>
        </div>
        
        <div className="p-6">
          <p className="text-xs text-blue-200 uppercase font-bold mb-1">Signed in as</p>
          <h2 className="text-xl font-bold capitalize">{role}</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  isActive ? 'bg-white/10 font-bold border-r-4 border-white' : 'text-blue-100 hover:bg-blue-800'
                }`
              }
            >
              {item.icon}<span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sign Out Button (Bottom of Sidebar) */}
        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-300 hover:bg-blue-900 hover:text-red-200 rounded transition-colors font-bold"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;