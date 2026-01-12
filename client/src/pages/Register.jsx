import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('tenant'); // Default role
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 2. Send Data to Backend
      // FIXED: Backend expects 'full_name', not 'username'
      const res = await api.post('/auth/register', {
        full_name: formData.username, // <--- THIS WAS THE FIX
        email: formData.email,
        password: formData.password,
        role: role
      });

      // 3. Success!
      alert("Registration Successful! Please Login.");
      navigate('/login');

    } catch (error) {
      console.error("Registration Error:", error);
      
      // Show the exact error message from the backend
      const message = error.response?.data?.error || "Registration Failed. Please check your internet.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" 
      title="Create Account" 
      subtitle="Join HomeHub today."
    >
      {/* Role Selection Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        <button 
          className={`flex-1 py-2 rounded-md text-sm font-bold transition ${role === 'tenant' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setRole('tenant')}
          type="button"
        >
          Tenant
        </button>
        <button 
          className={`flex-1 py-2 rounded-md text-sm font-bold transition ${role === 'landlord' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setRole('landlord')}
          type="button"
        >
          Landlord
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Full Name" 
          className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-brand-blue"
          onChange={e => setFormData({...formData, username: e.target.value})}
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
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
        <input 
          type="password" 
          placeholder="Confirm Password" 
          className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-brand-blue"
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          required 
        />
        
        <button 
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded mt-4 transition ${loading ? 'bg-gray-400' : 'bg-brand-blue hover:bg-blue-900'}`}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account? <Link to="/login" className="text-brand-blue font-bold hover:underline">Login here</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;