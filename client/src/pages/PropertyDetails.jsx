import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaChevronLeft, FaChevronRight, FaImages } from 'react-icons/fa';
import { useToast } from '../context/ToastContext.jsx';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { addToast } = useToast();
  
  // 🟢 NEW: State for Image Carousel & Role Check
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // 1. Fetch Property
    api.get(`/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error("Error loading property:", err))
      .finally(() => setLoading(false));

    // 2. 🟢 Get User Role safely
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserRole(parsed.role);
    }
  }, [id]);

  // 🟢 URL HELPER: Fixes "Cover photos not loading"
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x400?text=No+Image';
    // If it's a relative path, prepend the backend URL
    if (url.startsWith('/uploads') || !url.startsWith('http')) {
      return `https://homehub-backend-1.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  };

  // 🟢 CAROUSEL LOGIC: Next/Prev
  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
    }
  };
  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleLeaseNow = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return navigate('/login');
    
    if (!window.confirm(`Start Lease Process for ${property.name}?`)) return;

    setApplying(true);
    try {
      await api.post('/leases', { property_id: property.id });
      addToast("✅ Application Sent! Check your Tenant Dashboard.");
      // 🟢 Redirect to the dashboard we fixed earlier
      navigate('/dashboard/tenant');
    } catch (error) {
      addToast(error.response?.data?.error || "Application failed.", "error");
    } finally {
      setApplying(false);
    }
  };

  if (loading || !property) return <div className="p-20 text-center">Loading Property Details...</div>;

  // Determine current image to display
  const hasGallery = property.images && property.images.length > 0;
  const currentImageSrc = hasGallery 
    ? getImageUrl(property.images[currentImgIndex].image_url)
    : getImageUrl(property.image_url);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* 🟢 HERO SECTION WITH CAROUSEL */}
      <div className="h-96 w-full bg-gray-300 relative group overflow-hidden">
        <img 
          src={currentImageSrc} 
          alt={property.name} 
          className="w-full h-full object-cover transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 text-white">
          <div>
             <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
             <div className="flex items-center text-gray-200">
                <FaMapMarkerAlt className="mr-2" /> {property.address}, {property.city}
             </div>
          </div>
        </div>

        {/* Swipe Buttons (Only if gallery exists) */}
        {hasGallery && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 transition">
              <FaChevronLeft />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 transition">
              <FaChevronRight />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-xs font-bold">
              <FaImages className="inline mr-2" /> {currentImgIndex + 1} / {property.images.length}
            </div>
          </>
        )}
      </div>

      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Details */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm">
          {/* 🟢 NEW: Property Stats Grid */}
          <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-6 mb-6">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <FaBed className="text-2xl text-blue-500 mb-2" />
              <span className="font-bold text-gray-700">{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <FaBath className="text-2xl text-blue-500 mb-2" />
              <span className="font-bold text-gray-700">{property.bathrooms} Bathrooms</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <FaRulerCombined className="text-2xl text-blue-500 mb-2" />
              <span className="font-bold text-gray-700">{property.square_feet} sq ft</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Description</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          
          {property.amenities && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.split(',').map((item, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Action Box */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 h-fit">
          <p className="text-3xl font-bold text-blue-600 mb-2">KSh {property.price?.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mb-6">per month</p>
          
          {/* 🟢 LOGIC: Hide button for Landlords */}
          {userRole === 'landlord' ? (
            <div className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-lg text-center border border-gray-200">
              Landlord View Only
            </div>
          ) : (
            <button 
              onClick={handleLeaseNow} 
              disabled={applying} 
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md disabled:opacity-70"
            >
              {applying ? "Processing..." : "Lease This Property"}
            </button>
          )}

          <p className="text-xs text-center text-gray-400 mt-4">
            By clicking Lease, you agree to the terms of service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;