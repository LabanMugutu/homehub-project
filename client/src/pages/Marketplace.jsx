import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 👈 Import Navigation

const Marketplace = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate(); // 👈 Initialize Hook

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);

        const response = await axios.get(`${API_URL}/api/properties`);
        
        // 1. FILTER: Only show "Available" properties for tenants
        const approvedProperties = response.data.filter(p => p.status === 'Available');
        
        setProperties(approvedProperties);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load properties.");
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter by Search Term
  const filteredProperties = properties.filter(property =>
    property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Marketplace...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Properties</h1>
        
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              
              <img 
                src={property.image_url || "https://via.placeholder.com/400x300"} 
                alt={property.name} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {property.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-1 text-sm">{property.location}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    ${property.price} <span className="text-sm font-normal text-gray-500">/mo</span>
                  </span>
                </div>

                <div className="mt-3 flex gap-4 text-sm text-gray-500">
                   <span>🛏️ {property.bedrooms} Beds</span>
                   <span>🚿 {property.bathrooms} Baths</span>
                </div>

                {/* 2. CLICK ACTION: Navigate to Details Page */}
                <button 
                  onClick={() => navigate(`/properties/${property.id}`)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;