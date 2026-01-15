import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { FaBuilding, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaMoneyBillWave, FaCamera } from 'react-icons/fa';
import { useToast } from '../../../context/ToastContext.jsx';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { addToast } = useToast();
  // State for text fields
  const [formData, setFormData] = useState({
    name: '', 
    description: '',
    address: '',
    city: '',
    state: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    property_type: 'apartment',
    amenities: ''
  });

  // State for Files
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Main Image Selection
  const handleMainImageChange = (e) => {
    if (e.target.files[0]) setMainImage(e.target.files[0]);
  };

  // Handle Gallery Selection
  const handleGalleryChange = (e) => {
    if (e.target.files) setGalleryImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Build FormData (This is the critical part for file uploads)
    const data = new FormData();
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    // Append Main Image
    if (mainImage) {
      data.append('image', mainImage);
    }

    // Append Gallery Images (Looping through the array)
    galleryImages.forEach(file => {
      data.append('gallery_images', file);
    });

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // 2. Send Request
      await axios.post(`${API_URL}/api/properties`, data, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          // Axios sets the Content-Type to multipart/form-data automatically when it sees FormData
        }
      });

      addToast("Property listed successfully!", "success");
      navigate('/dashboard/landlord'); 

    } catch (error) {
      console.error("Error creating property:", error);
      const msg = error.response?.data?.error || "Failed to list property. Check console.";
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="List New Property" role="landlord">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaBuilding className="text-blue-600" /> Property Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the information below to list your property.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Title</label>
              <input name="name" type="text" placeholder="e.g. Modern 2-Bedroom Apartment" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} required />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea name="description" rows="4" placeholder="Describe the property..." className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} required></textarea>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" /> Address
              </label>
              <input name="address" type="text" placeholder="Street Address" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
              <input name="city" type="text" placeholder="Nairobi" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">County</label>
              <input name="state" type="text" placeholder="Nairobi" className="w-full px-4 py-3 rounded border focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
              <select name="property_type" className="w-full px-4 py-3 rounded border bg-white focus:ring-2 focus:ring-blue-500 outline-none" onChange={handleChange}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="office">Office</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Specs & Price */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2"><FaBed className="inline mr-1 text-gray-400"/> Beds</label>
              <input type="number" name="bedrooms" className="w-full px-4 py-3 rounded border" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2"><FaBath className="inline mr-1 text-gray-400"/> Baths</label>
              <input type="number" name="bathrooms" className="w-full px-4 py-3 rounded border" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2"><FaRulerCombined className="inline mr-1 text-gray-400"/> Sq Ft</label>
              <input type="number" name="square_feet" className="w-full px-4 py-3 rounded border" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2"><FaMoneyBillWave className="inline mr-1 text-green-500"/> Rent</label>
              <input type="number" name="price" className="w-full px-4 py-3 rounded border" onChange={handleChange} required />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 4: IMAGE UPLOAD (The Fix) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="bg-blue-50 p-4 rounded border-dashed border-2 border-blue-200">
              <label className="block text-sm font-bold text-blue-800 mb-2"><FaCamera className="inline mr-1"/> Main Cover Image</label>
              <input type="file" onChange={handleMainImageChange} className="w-full" accept="image/*" />
            </div>

            {/* Gallery Images */}
            <div className="bg-gray-50 p-4 rounded border-dashed border-2 border-gray-300">
              <label className="block text-sm font-bold text-gray-700 mb-2">Gallery (Select Multiple)</label>
              <input type="file" multiple onChange={handleGalleryChange} className="w-full" accept="image/*" />
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple photos.</p>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition shadow-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Uploading...' : 'Publish Property Listing'}
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;