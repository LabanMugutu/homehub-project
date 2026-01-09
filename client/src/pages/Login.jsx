import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // <--- IMPORT THE NEW CONNECTOR

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // connecting to: https://homehub-backend-1.onrender.com/api/auth/login
      const res = await api.post('/auth/login', formData);
      
      // 1. Save Token & User Details
      localStorage.setItem('token', res.data.access_token); // Flask-JWT usually returns 'access_token'
      localStorage.setItem('userName', res.data.user?.name || 'User');
      localStorage.setItem('userRole', res.data.user?.role || 'tenant');
      localStorage.setItem('userEmail', formData.email); 
      
      alert(`Login Successful! Welcome, ${res.data.user?.name || 'User'}`);

      // 2. Redirect based on Role
      const role = res.data.user?.role;
      if (role === 'landlord') {
        navigate('/landlord/dashboard');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/tenant/dashboard'); 
      }

    } catch (error) {
      console.error("Login Error:", error);
      // Show the exact error message from the backend if available
      const message = error.response?.data?.message || "Invalid credentials or Server Error";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      imageSrc="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80" 
      title="Welcome Back" 
      subtitle="Login to your dashboard."
    >
      <h2 className="text-3xl font-bold text-brand-blue mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-brand-blue" 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-brand-blue" 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required
        />
        <button 
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded mt-4 transition ${loading ? 'bg-gray-400' : 'bg-brand-blue hover:bg-blue-900'}`}
        >
          {loading ? 'Connecting...' : 'Login'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;