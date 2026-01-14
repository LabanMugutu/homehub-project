import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaUserCircle, FaPhone, FaEnvelope, FaFileSignature, FaCheckCircle } from 'react-icons/fa';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLeaseNow = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'tenant') return alert("Only tenants can apply.");
    
    if (!window.confirm(`Start Lease Process for ${property.name}?`)) return;

    setApplying(true);
    try {
      await api.post('/leases', { property_id: property.id });
      alert("✅ Application Sent! Check your dashboard for updates.");
      navigate('/dashboard/applications');
    } catch (error) {
      alert(error.response?.data?.error || "Application failed.");
    } finally {
      setApplying(false);
    }
  };

  if (loading || !property) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-96 w-full bg-gray-300 relative">
        <img src={property.image_url || "https://via.placeholder.com/1600x600"} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-8 text-white">
          <div>
            <h1 className="text-4xl font-bold">{property.name}</h1>
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> {property.city}, Kenya</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-3xl font-bold text-blue-600 mb-6">KSh {property.price?.toLocaleString()}/mo</p>
          <div className="grid grid-cols-3 gap-4 border-y py-6 mb-6 text-gray-600">
            <span>🛏️ {property.bedrooms} Beds</span>
            <span>🚿 {property.bathrooms} Baths</span>
            <span>📐 {property.square_feet} sq ft</span>
          </div>
          <p className="text-gray-600">{property.description}</p>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h3 className="font-bold mb-4 text-gray-800">Ready to move in?</h3>
            <button onClick={handleLeaseNow} disabled={applying} className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2">
              {applying ? "Sending..." : <><FaFileSignature /> Lease Now</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;