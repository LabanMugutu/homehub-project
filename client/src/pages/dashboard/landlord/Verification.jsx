import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('national_id', nationalId);
    data.append('kra_pin', kraPin);
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

      alert("Uploaded! Log out and log back in to refresh your status.");
      navigate('/dashboard/landlord');
    } catch (error) {
      console.error(error);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Verify Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" 
            placeholder="National ID"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="w-full p-3 border rounded border-gray-300"
            required
          />

          <input 
            type="text" 
            placeholder="KRA PIN"
            value={kraPin}
            onChange={(e) => setKraPin(e.target.value)}
            className="w-full p-3 border rounded border-gray-300"
            required
          />

          {/* 👇 THE UNBREAKABLE FIX: A Label that wraps the input */}
          <label className="block w-full border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-100 transition">
            
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">📂</span>
              <span className="font-bold text-blue-700">Click Here to Browse</span>
              <span className="text-sm text-blue-500">
                {idFile ? `Selected: ${idFile.name}` : "Upload ID Document"}
              </span>
            </div>

            {/* Hidden Input inside the Label - HTML handles the click automatically */}
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setIdFile(e.target.files[0])}
              accept="image/*,.pdf"
            />
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Submit Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;