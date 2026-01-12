import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Could not load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!property) return <div className="text-center py-20">Property not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Image Section */}
      <div className="relative h-[60vh] bg-gray-900">
        <img 
          src={property.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"} 
          alt={property.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="max-w-6xl mx-auto text-white">
            <span className="bg-brand-blue px-3 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 inline-block">
              {property.property_type}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{property.title}</h1>
            <p className="text-xl flex items-center gap-2 text-gray-200">
              <FaMapMarkerAlt className="text-brand-gold" /> {property.address}, {property.city}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full -mt-20 relative z-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Stats Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 flex justify-between items-center text-center">
             <div>
               <p className="text-gray-400 text-sm uppercase font-bold">Price</p>
               <p className="text-2xl font-bold text-brand-blue">KES {property.price?.toLocaleString()}</p>
             </div>
             <div className="h-10 w-px bg-gray-200"></div>
             <div>
               <p className="text-gray-400 text-sm uppercase font-bold">Bedrooms</p>
               <p className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2"><FaBed/> {property.bedrooms}</p>
             </div>
             <div className="h-10 w-px bg-gray-200"></div>
             <div>
               <p className="text-gray-400 text-sm uppercase font-bold">Bathrooms</p>
               <p className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2"><FaBath/> {property.bathrooms}</p>
             </div>
             <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
             <div className="hidden md:block">
               <p className="text-gray-400 text-sm uppercase font-bold">Size</p>
               <p className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2"><FaRulerCombined/> {property.square_feet} sqft</p>
             </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">About this Property</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.amenities ? property.amenities.split(',').map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span>{amenity.trim()}</span>
                </div>
              )) : <p className="text-gray-400 italic">No specific amenities listed.</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Action Box */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">Monthly Rent</p>
              <h2 className="text-3xl font-bold text-brand-blue">KES {property.price?.toLocaleString()}</h2>
            </div>
            
            <button 
              onClick={() => alert("Lease Application Feature Coming Soon!")}
              className="w-full bg-brand-gold text-brand-blue font-bold py-4 rounded-lg hover:bg-yellow-400 transition mb-4 shadow-md"
            >
              Apply Now
            </button>
            
            <button className="w-full border-2 border-brand-blue text-brand-blue font-bold py-3 rounded-lg hover:bg-blue-50 transition">
              Schedule Viewing
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Protected by HomeHub SafeRent Guarantee.
            </p>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetails;