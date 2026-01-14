import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const navigate = useNavigate();
  
  // 1. REFS: These act as the "remote control" for the hidden file inputs
  const idInputRef = useRef(null);
  const kraInputRef = useRef(null);

  // State
  const [formData, setFormData] = useState({
    national_id: '',
    kra_pin: ''
  });
  const [idFile, setIdFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. CLICK HANDLERS: These trigger the hidden inputs
  const handleIdClick = () => {
    idInputRef.current.click();
  };
  
  // Handle File Selection
  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('national_id', formData.national_id);
    data.append('kra_pin', formData.kra_pin);
    if (idFile) data.append('document', idFile);
    // If you need KRA cert upload too, append it here as well

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // We need a specific endpoint for verification uploads
      await axios.post(`${API_URL}/api/users/verify-upload`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("Documents uploaded! Admin will review shortly.");
      navigate('/dashboard/landlord');

    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Landlord Verification</h2>
          <p className="mt-2 text-gray-600">We need a few details to activate your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* National ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">National ID Number</label>
            <input 
              name="national_id" 
              type="text" 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* KRA PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">KRA PIN</label>
            <input 
              name="kra_pin" 
              type="text" 
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* UPLOAD SECTION */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID / Passport Copy</label>
            
            {/* 3. THE MAGIC CLICKABLE AREA */}
            <div 
              onClick={handleIdClick} // 👈 This makes the div clickable
              className="border-2 border-dashed border-blue-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
            >
              <svg className="h-12 w-12 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-blue-600 font-medium">Browse here</span>
              <span className="text-gray-400 text-sm mt-1">or drop file here</span>
            </div>

            {/* 4. THE HIDDEN INPUT (Actual Worker) */}
            <input 
              type="file" 
              ref={idInputRef} // 👈 Linked to the ref
              className="hidden" // 👈 Hidden from view
              onChange={(e) => handleFileChange(e, setIdFile)}
              accept="image/*,.pdf"
            />

            {/* File Preview */}
            {idFile && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                ✅ Selected: <span className="font-semibold">{idFile.name}</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Uploading...' : 'Submit Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;