import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, 
  FaUserCircle, FaPhone, FaEnvelope, FaFileSignature, FaCheckCircle
} from 'react-icons/fa';

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
    if (user.role !== 'tenant') return alert("Only tenants can apply for leases.");
    
    if (!window.confirm(`Start Lease Process for ${property.title}?\n\nThis will send a direct application to the landlord.`)) return;

    setApplying(true);
    try {
      // 🚀 Send Application
      await api.post('/leases', { property_id: property.id });
      
      alert("✅ Application Sent!\n\nThe landlord has been notified. Check 'My Applications' for updates.");
      navigate('/dashboard/applications');
    } catch (error) {
      alert(error.response?.data?.error || "Application failed. You may already have a pending request.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading property...</div>;
  if (!property) return <div className="p-20 text-center">Property not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Image */}
      <div className="h-96 w-full bg-gray-300 relative">
        <img 
          src={property.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-6 py-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
            <p className="flex items-center gap-2 text-lg"><FaMapMarkerAlt /> {property.address}, {property.city}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                    <FaCheckCircle /> Verified Listing
                  </span>
                  <span className="text-gray-500 capitalize">• {property.property_type}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-blue">${property.price?.toLocaleString()}/mo</p>
                <p className="text-sm text-gray-500">Utilities included</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-blue-50 p-3 rounded-full text-brand-blue"><FaBed /></div>
                <div><span className="block font-bold text-gray-800">{property.bedrooms || '-'}</span> Bedrooms</div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-blue-50 p-3 rounded-full text-brand-blue"><FaBath /></div>
                <div><span className="block font-bold text-gray-800">{property.bathrooms || '-'}</span> Bathrooms</div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-blue-50 p-3 rounded-full text-brand-blue"><FaRulerCombined /></div>
                <div><span className="block font-bold text-gray-800">{property.square_feet || 'N/A'}</span> sq ft</div>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>
        </div>

        {/* Sidebar: Actions */}
        <div className="space-y-6">
          
          {/* Landlord Contact */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUserCircle className="text-brand-blue" /> Property Manager
            </h3>
            <div className="flex items-center gap-4 mb-4">
               <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                 {property.landlord_name ? property.landlord_name.charAt(0) : "L"}
               </div>
               <div>
                 <p className="font-bold text-gray-800">{property.landlord_name || "Private Landlord"}</p>
                 <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                   <FaCheckCircle /> Identity Verified
                 </p>
               </div>
            </div>
            <div className="space-y-2 text-sm">
               <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                 <FaPhone /> <span>{property.landlord_phone || "No phone listed"}</span>
               </div>
               <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                 <FaEnvelope /> <span className="truncate">{property.landlord_email || "No email listed"}</span>
               </div>
            </div>
          </div>

          {/* 🚀 LEASE ACTION CARD */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-blue/20 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-2">Ready to move in?</h3>
            <p className="text-sm text-gray-500 mb-4">Skip the viewing and apply for a lease directly.</p>
            
            <div className="flex flex-col gap-3">
              {user && user.role === 'tenant' ? (
                <button 
                  onClick={handleLeaseNow}
                  disabled={applying}
                  className="w-full py-4 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-900 transition flex justify-center items-center gap-2 shadow-md"
                >
                  {applying ? "Sending..." : <><FaFileSignature /> Lease Now</>}
                </button>
              ) : !user ? (
                <button onClick={() => navigate('/login')} className="w-full py-3 bg-gray-800 text-white rounded-lg">
                  Login to Lease
                </button>
              ) : null}

              <button 
                onClick={() => alert("Tour booking feature coming soon!")}
                className="w-full py-3 border border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition"
              >
                Schedule Viewing
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;