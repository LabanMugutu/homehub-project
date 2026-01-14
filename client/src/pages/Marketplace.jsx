import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Build the URL using the environment variable set on Render
        let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);

        const response = await axios.get(`${API_URL}/api/properties`);
        
        // 🟢 FIX 1: Broader Filter Logic
        // We look for 'approved' (from your seed) or 'available' (from manual create)
        const visibleProperties = response.data.filter(p => {
          const status = p.status ? p.status.toLowerCase() : '';
          return status === 'approved' || status === 'available';
        });

        setProperties(visibleProperties);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load properties. Please try again later.");
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // 🟢 FIX 2: Dynamic Search Logic
  // Searching by 'name', 'city', or 'address' to match your backend JSON keys
  const filteredProperties = properties.filter(property => {
    const search = searchTerm.toLowerCase();
    return (
      property.name?.toLowerCase().includes(search) ||
      property.city?.toLowerCase().includes(search) ||
      property.address?.toLowerCase().includes(search)
    );
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
       <div className="text-xl font-bold text-blue-600 animate-pulse">Loading Marketplace...</div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Available Properties</h1>
          <p className="text-gray-600">Explore 11+ verified properties in Nairobi, Mombasa, and beyond.</p>
          
          {/* Search Input */}
          <div className="mt-6 max-w-xl">
            <input
              type="text"
              placeholder="Search by name, city, or street..."
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Grid Display */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={property.image_url || "https://via.placeholder.com/400x300"} 
                    alt={property.name} 
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-700 shadow-sm uppercase">
                    {property.property_type}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 truncate pr-2">{property.name}</h3>
                    <span className="text-blue-600 font-extrabold whitespace-nowrap">
                      KSh {property.price?.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-4">📍 {property.address}, {property.city}</p>

                  <div className="flex justify-between border-t pt-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">🛏️ {property.bedrooms} Beds</span>
                    <span className="flex items-center gap-1">🚿 {property.bathrooms} Baths</span>
                    <span className="flex items-center gap-1">📏 {property.square_feet || '—'} sqft</span>
                  </div>

                  <button 
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-2xl shadow-inner text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-gray-800">No properties found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Show all properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;