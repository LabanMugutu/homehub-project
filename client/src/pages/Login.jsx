import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', formData);
      
      // 1. Save Token & User Data
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // 2. 🚨 SMART REDIRECT LOGIC 🚨
      const role = res.data.user.role;
      
      if (role === 'admin') {
        navigate('/admin'); // Admins go to Admin Panel
      } else {
        navigate('/dashboard'); // Landlords & Tenants go to Dashboard
      }

    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Login to manage your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="name@example.com"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                name="password" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition shadow-md"
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account? <Link to="/register" className="text-brand-blue font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;