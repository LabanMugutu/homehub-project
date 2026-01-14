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
        let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Clean trailing slashes
        if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);

        const response = await axios.get(`${API_URL}/api/properties`);
        
        // 🟢 FIX 1: Map status to 'approved' to match your seed.py
        const approvedProperties = response.data.filter(p => p.status === 'approved');
        
        setProperties(approvedProperties);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load properties. Check your connection.");
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // 🟢 FIX 2: Use 'city' for searching as that is what your backend sends
  const filteredProperties = properties.filter(property =>
    property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
       <div className="text-xl font-semibold text-blue-600 animate-pulse">Loading HomeHub Marketplace...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
       <div className="text-red-500 bg-red-100 p-4 rounded-lg shadow">{error}</div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Available Properties</h1>
                <p className="text-gray-600">Find your next home from our verified listings.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder="Search by name or city (e.g. Nairobi)..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>
        </header>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
                <div 
                    key={property.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                {/* Property Image */}
                <div className="relative">
                    <img 
                        src={property.image_url || "https://via.placeholder.com/400x300?text=No+Image+Available"} 
                        alt={property.name} 
                        className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                        {property.property_type || 'Property'}
                    </div>
                </div>
                
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{property.name}</h3>
                        <span className="text-green-600 font-bold text-lg">
                            KSh {property.price?.toLocaleString()}
                        </span>
                    </div>
                    
                    {/* 🟢 FIX 3: Use 'city' here instead of 'location' */}
                    <p className="text-gray-500 mb-4 flex items-center text-sm">
                        <span className="mr-1">📍</span> {property.city}, Kenya
                    </p>
                    
                    <div className="flex justify-between items-center border-t border-b py-3 mb-4 text-gray-600 text-sm">
                        <span className="flex items-center gap-1">🛏️ {property.bedrooms} Beds</span>
                        <span className="flex items-center gap-1">🚿 {property.bathrooms} Baths</span>
                        <span className="flex items-center gap-1">📐 {property.square_feet || '1200'} sqft</span>
                    </div>

                    <button 
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
                    >
                        View Details
                    </button>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-inner">
                <p className="text-gray-500 text-lg">No properties found matching "{searchTerm}"</p>
                <button 
                    onClick={() => setSearchTerm('')} 
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Clear Search
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;