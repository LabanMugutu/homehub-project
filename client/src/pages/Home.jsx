import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaSearch, FaHome, FaUserCheck } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center text-center text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gray-900">
            <img 
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80" 
                alt="Modern Home" 
                className="w-full h-full object-cover opacity-40"
            />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect Home <span className="text-brand-gold">Today</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            The most trusted marketplace for rentals in Nairobi. Verified landlords, secure payments, and zero hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/marketplace" 
              className="bg-brand-blue text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition shadow-lg flex items-center justify-center gap-2"
            >
              <FaSearch /> Browse Properties
            </Link>
            <Link 
              to="/register" 
              className="bg-brand-gold text-brand-blue px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition shadow-lg flex items-center justify-center gap-2"
            >
              <FaUserCheck /> List Your Property
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800">Why Choose HomeHub?</h2>
                <p className="text-gray-500 mt-2">We make renting easier for everyone.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue text-2xl">
                        <FaUserCheck />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Verified Landlords</h3>
                    <p className="text-gray-600">Every landlord on our platform is verified with National ID to ensure your safety.</p>
                </div>
                <div className="p-6">
                    <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-gold text-2xl">
                        <FaHome />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Quality Listings</h3>
                    <p className="text-gray-600">High-quality photos and detailed descriptions so you know exactly what you're renting.</p>
                </div>
                <div className="p-6">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
                        <FaSearch />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Easy Search</h3>
                    <p className="text-gray-600">Filter by location, price, and amenities to find your dream home in seconds.</p>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;