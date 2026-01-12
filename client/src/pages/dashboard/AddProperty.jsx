import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import UploadWidget from '../../components/UploadWidget'; // Reusing our widget
import api from '../../api/axios'; // Connecting to Render Backend
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaBed, FaBath, FaSave } from 'react-icons/fa';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    image_url: '', // Will hold the Cloudinary URL
    beds: 1,
    baths: 1
  });

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload Success
  const handleImageUpload = (url) => {
    setFormData({ ...formData, image_url: url });
  };

  // Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic Validation
    if (!formData.image_url) {
      alert("Please upload a property image first.");
      setLoading(false);
      return;
    }

    try {
      // POST request to https://homehub-backend-1.onrender.com/api/properties
      await api.post('/properties', {
        ...formData,
        price: parseFloat(formData.price), // Ensure numbers are sent as numbers
        beds: parseInt(formData.beds),
        baths: parseInt(formData.baths)
      });

      alert("Property Listed Successfully!");
      navigate('/landlord/properties'); // Go back to the list
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to list property. " + (error.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add New Property">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaBuilding className="text-brand-blue" /> Property Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Title</label>
              <input 
                type="text" name="title" required
                placeholder="e.g. Sunset Apartments"
                className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                <FaMapMarkerAlt /> Location
              </label>
              <input 
                type="text" name="location" required
                placeholder="e.g. Kilimani, Nairobi"
                className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Price & Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <FaMoneyBillWave /> Monthly Rent (Ksh)
            </label>
            <input 
              type="number" name="price" required
              placeholder="e.g. 45000"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" rows="4" required
              placeholder="Describe the amenities, nearby schools, etc."
              className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Details (Beds/Baths) */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><FaBed /> Bedrooms</label>
              <select name="beds" className="w-full border p-3 rounded bg-white" onChange={handleChange}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><FaBath /> Bathrooms</label>
              <select name="baths" className="w-full border p-3 rounded bg-white" onChange={handleChange}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Property Image</label>
            
            {formData.image_url ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 group">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <UploadWidget onUpload={handleImageUpload} buttonText="Change Photo" />
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <p className="text-gray-500 text-sm mb-4">Upload a high-quality image of the property.</p>
                <div className="flex justify-center">
                  <UploadWidget onUpload={handleImageUpload} buttonText="Upload Photo" />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-lg shadow-lg flex justify-center items-center gap-2 transition ${loading ? 'bg-gray-400' : 'bg-brand-blue hover:bg-blue-900'}`}
            >
              {loading ? 'Saving Property...' : <><FaSave /> Publish Listing</>}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;