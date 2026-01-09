import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 text-brand-blue"><FaHome className="text-2xl" /><span className="text-2xl font-bold tracking-tight">HomeHub</span></div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="px-5 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 text-sm font-bold transition">Sign In</Link>
          <Link to="/register" className="px-5 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-800 text-sm font-bold transition">Register</Link>
        </div>
      </nav>
      <header className="bg-gradient-to-b from-blue-600 to-blue-400 text-white relative h-[500px] flex items-center overflow-hidden">
        <div className="container mx-auto px-8 flex flex-col-reverse md:flex-row items-center h-full">
          <div className="md:w-1/2 h-full flex items-end justify-center relative"><img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80" alt="Happy Tenant" className="h-[95%] object-contain relative z-10" /></div>
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left z-20">
             <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Welcome to <br/> HomeHub</h1>
             <p className="text-xl mb-8 opacity-90 font-light">Ready to find your next home?</p>
             <Link to="/register" className="bg-white text-brand-blue px-8 py-3 rounded font-bold hover:bg-gray-100 transition shadow-lg">Find a House</Link>
          </div>
        </div>
      </header>
    </div>
  );
};
export default LandingPage;