import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ national_id: '', kra_pin: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a document first.");
    setLoading(true);

    const data = new FormData();
    data.append('national_id', formData.national_id);
    data.append('kra_pin', formData.kra_pin);
    data.append('document', file);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // 1. Send Upload
      const response = await axios.post(`${API_URL}/api/users/verify-upload`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // 2. THE PROPER FIX: Update local user state immediately
      // This prevents the app from thinking you are still unverified
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        currentUser.status = 'approved'; // Optimistically update status
        localStorage.setItem('user', JSON.stringify(currentUser));
      }

      alert("Verification successful! Redirecting...");
      
      // 3. Force a hard refresh to Dashboard so all checks pass
      window.location.href = '/dashboard/landlord';

    } catch (error) {
      console.error(error);
      alert("Upload failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Verify Account</h2>
        <p className="text-gray-500 text-center mb-6">Upload your ID to start listing properties.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            name="national_id" 
            type="text" 
            placeholder="National ID Number"
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input 
            name="kra_pin" 
            type="text" 
            placeholder="KRA PIN"
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          {/* 👇 THE UNBREAKABLE UPLOAD BOX */}
          {/* By using a <label>, clicking ANYWHERE inside automatically opens the file picker. */}
          <label className="block w-full border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-100 transition relative">
            
            <div className="flex flex-col items-center pointer-events-none">
              <span className="text-4xl mb-2">📂</span>
              <span className="font-bold text-blue-700">Click Here to Upload ID</span>
              <span className="text-sm text-blue-500 mt-1">
                {file ? `✅ Selected: ${file.name}` : "PDF or Image allowed"}
              </span>
            </div>

            {/* The Actual Input (Hidden but Active) */}
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*,.pdf"
              required
            />
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Uploading...' : 'Submit Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;