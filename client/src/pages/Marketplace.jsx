import React, { useState, useEffect } from 'react';
import axios from 'axios';
// If you have a Layout component, keep the import
// import Layout from '../components/Layout'; 

const Marketplace = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data from Backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Use the environment variable we set in Render
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Call the endpoint
        const response = await axios.get(`${API_URL}/properties`);
        
        // Update state with live data
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again.");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // 2. Filter Logic (Optional: keeps search working)
  const filteredProperties = properties.filter(property =>
    property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Marketplace...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              
              {/* Image Handling */}
              <img 
                src={property.image_url || "https://via.placeholder.com/400x300?text=No+Image"} 
                alt={property.name} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {property.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-1 text-sm">{property.location}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    ${property.price} <span className="text-sm font-normal text-gray-500">/mo</span>
                  </span>
                </div>

                {/* Features Badges */}
                <div className="mt-3 flex gap-2 text-sm text-gray-500">
                   <span>🛏️ {property.bedrooms} Bed</span>
                   <span>🚿 {property.bathrooms} Bath</span>
                </div>

                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProperties.length === 0 && (
           <p className="text-center text-gray-500 mt-10">No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;