import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const navigate = useNavigate();
  
  // 1. CREATE THE REFS (The "Remote Controls")
  const idInputRef = useRef(null);

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

  // 2. THE CLICK HANDLER (The "Trigger")
  // When you click the Div, this function runs and clicks the hidden input
  const handleIdClick = () => {
    if (idInputRef.current) {
      idInputRef.current.click();
    }
  };
  
  // Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('national_id', formData.national_id);
    data.append('kra_pin', formData.kra_pin);
    if (idFile) data.append('document', idFile);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      await axios.post(`${API_URL}/api/users/verify-upload`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("Documents uploaded! Please log out and log back in.");
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
          <p className="mt-2 text-gray-600">Complete your profile to add properties.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <input name="national_id" type="text" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-3" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">KRA PIN</label>
            <input name="kra_pin" type="text" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-3" required />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Document</label>
            
            {/* 3. THE VISIBLE CLICKABLE BOX */}
            <div 
              onClick={handleIdClick} // 👈 Clicking this triggers the function above
              className="border-2 border-dashed border-blue-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
            >
              <span className="text-blue-600 font-medium">Browse here</span>
              <span className="text-gray-400 text-sm mt-1">or drop file here</span>
            </div>

            {/* 4. THE HIDDEN INPUT */}
            <input 
              type="file" 
              ref={idInputRef} // 👈 This connects it to the Ref
              className="hidden" // 👈 It stays hidden
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />

            {idFile && (
              <div className="mt-2 text-sm text-green-600">✅ Selected: {idFile.name}</div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            {loading ? 'Uploading...' : 'Submit Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;