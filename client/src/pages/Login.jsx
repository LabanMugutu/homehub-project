import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', formData);
      
      // 1. Save Token & User Details to Local Storage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('userEmail', formData.email); // Saving email since we used it to login
      
      // 2. Alert the user
      alert(`Login Successful! Welcome, ${res.data.name}`);

      // 3. Redirect based on Role
      if (res.data.role === 'landlord') {
        navigate('/landlord/dashboard');
      } else if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/tenant/dashboard'); 
      }
    } catch (error) {
      console.error(error);
      alert("Invalid credentials or Server Error");
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
        <button className="w-full bg-brand-blue text-white font-bold py-3 rounded mt-4 hover:bg-blue-900 transition">
          Login
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;