import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'tenant',
    phone_number: '', // 🟢 Synchronized with backend models.py
    national_id: '',  // 🟢 Added for Landlord verification
    kra_pin: '',      // 🟢 Added for Landlord verification
    admin_secret: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🟢 formData now includes the correct keys (phone_number, kra_pin, etc.)
      await api.post('/auth/register', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Join HomeHub today</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-center border border-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="full_name" 
                required 
                className="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-600 outline-none transition" 
                onChange={handleChange} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-600 outline-none transition" 
                  onChange={handleChange} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phone_number" 
                  required 
                  placeholder="07..."
                  className="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-600 outline-none transition" 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-600 outline-none transition" 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">I am a:</label>
              <select 
                name="role" 
                className="w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-600 outline-none bg-white transition" 
                onChange={handleChange}
                value={formData.role}
              >
                <option value="tenant">Tenant (Looking for a home)</option>
                <option value="landlord">Landlord (Listing a home)</option>
              </select>
            </div>

            {/* --- 🟢 CONDITIONAL LANDLORD FIELDS --- */}
            {formData.role === 'landlord' && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-100 animate-pulse">
                <p className="text-xs font-bold text-blue-700 uppercase">Verification Details Required</p>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">National ID Number</label>
                  <input 
                    type="text" 
                    name="national_id" 
                    required={formData.role === 'landlord'}
                    className="w-full px-4 py-2 rounded border bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm" 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">KRA PIN</label>
                  <input 
                    type="text" 
                    name="kra_pin" 
                    required={formData.role === 'landlord'}
                    className="w-full px-4 py-2 rounded border bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm" 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            )}

            {/* --- 🔐 ADMIN SECRET FIELD --- */}
            <div className="pt-6 border-t border-gray-100 mt-4">
              <label className="block text-xs font-bold text-gray-400 mb-1">Admin Key (Staff Only)</label>
              <input 
                type="text" 
                name="admin_secret" 
                placeholder="Enter key for Staff privileges" 
                className="w-full px-4 py-2 rounded border border-gray-200 text-sm focus:ring-2 focus:ring-gray-400 outline-none transition" 
                onChange={handleChange} 
              />
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition mt-6 shadow-md disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;