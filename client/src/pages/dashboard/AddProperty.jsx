import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { FaBuilding, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaMoneyBillWave, FaImage } from 'react-icons/fa';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // --- 🔒 VERIFICATION CHECK ---
  useEffect(() => {
    // 1. Get user data from storage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    // 2. Gatekeeper Logic: Redirect if Landlord is not Active
    if (user && user.role === 'landlord' && user.status !== 'active') {
      alert("⚠️ Account Not Verified!\n\nYou must upload your ID and be approved by an Admin before you can post properties.");
      navigate('/dashboard/settings'); // Redirect to Settings/ID Upload
    }
  }, [navigate]);
  // -----------------------------

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '', // This will serve as "County" or Region
    zip_code: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    property_type: 'apartment', // Default
    amenities: '', // Comma separated string
    image_url: '' // For now, we paste a URL. Later we can add file upload.
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the property
      await api.post('/properties', formData);
      alert("Property Listed Successfully!");
      navigate('/dashboard/landlord'); // Go back to dashboard
    } catch (error) {
      console.error("Error creating property:", error);
      alert(error.response?.data?.error || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="List New Property" role="landlord">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaBuilding className="text-brand-blue" /> Property Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the information below to list your property.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Modern 2-Bedroom Apartment in Kilimani" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" 
                rows="4" 
                placeholder="Describe the property features, nearby amenities, etc."
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Location & Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" /> Address
              </label>
              <input 
                type="text" 
                name="address" 
                placeholder="Street Address" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
              <input 
                type="text" 
                name="city" 
                placeholder="Nairobi" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">County/State</label>
              <input 
                type="text" 
                name="state" 
                placeholder="Nairobi" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
              <select 
                name="property_type" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                onChange={handleChange}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
                <option value="office">Office Space</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Specs & Price */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaBed className="text-gray-400" /> Bedrooms
              </label>
              <input type="number" name="bedrooms" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaBath className="text-gray-400" /> Bathrooms
              </label>
              <input type="number" name="bathrooms" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaRulerCombined className="text-gray-400" /> Sq. Ft
              </label>
              <input type="number" name="square_feet" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" /> Rent (KES)
              </label>
              <input type="number" name="price" placeholder="e.g. 45000" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none" onChange={handleChange} required />
            </div>
          </div>

          {/* Section 4: Image URL (Temporary until Cloudinary) */}
          <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaImage className="text-gray-400" /> Property Image URL
              </label>
              <input 
                type="url" 
                name="image_url" 
                placeholder="Paste an image link (e.g. from Unsplash)" 
                className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-brand-blue outline-none"
                onChange={handleChange}
              />
              <p className="text-xs text-gray-400 mt-1">Leave blank to use default placeholder.</p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg transition shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-blue-900 hover:shadow-xl'}`}
            >
              {loading ? 'Publishing...' : 'Publish Property Listing'}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;