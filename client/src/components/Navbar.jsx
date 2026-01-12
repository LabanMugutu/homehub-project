import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-brand-blue flex items-center gap-2">
            <span className="bg-brand-blue text-white px-2 rounded">H</span> HomeHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-brand-blue font-medium">Home</Link>
            <Link to="/marketplace" className="text-gray-600 hover:text-brand-blue font-medium">Marketplace</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-brand-blue font-bold hover:underline">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 font-bold hover:text-brand-blue">Login</Link>
                <Link to="/register" className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-900 transition shadow-md">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;