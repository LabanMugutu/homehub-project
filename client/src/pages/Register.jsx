import React, { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('landlord');
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/register', { ...formData, role });
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (error) { alert("Registration failed. Email might be taken."); }
  };

  return (
    <AuthLayout imageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" title="Join HomeHub" subtitle="The trusted platform for rentals.">
      <h2 className="text-3xl font-bold text-brand-blue mb-2">Create Account</h2>
      <div className="flex gap-4 mb-6 mt-4">
        {['landlord', 'tenant'].map((r) => (
          <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 px-4 rounded border capitalize font-bold ${role === r ? 'bg-brand-blue text-white' : 'bg-white text-gray-500'}`}>{r}</button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded border" onChange={e => setFormData({...formData, full_name: e.target.value})} />
        <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded border" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded border" onChange={e => setFormData({...formData, password: e.target.value})} />
        <button className="w-full bg-brand-blue text-white font-bold py-3 rounded mt-4">Register</button>
      </form>
    </AuthLayout>
  );
};
export default Register;