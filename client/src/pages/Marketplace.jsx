import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const Marketplace = () => {
  const [filterPrice, setFilterPrice] = useState(100000);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Mock Properties
  const properties = [
    { id: 1, title: "Modern Loft", location: "Kileleshwa", price: 65000, rating: 4.8, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80" },
    { id: 2, title: "Cozy Studio", location: "Roysambu", price: 15000, rating: 4.2, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80" },
    { id: 3, title: "Family Villa", location: "Karen", price: 120000, rating: 5.0, img: "https://images.unsplash.com/photo-1600596542815-22b5c013eb53?auto=format&fit=crop&q=80" },
  ];

  const handleBook = (prop) => {
    setSelectedProperty(prop);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-40 flex justify-between items-center">
        <Link to="/" className="font-bold text-brand-blue text-xl">🏠 HomeHub</Link>
        <Link to="/login" className="text-gray-600 font-medium">Login</Link>
      </nav>

      <div className="max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-8">
        
        {/* FILTERS SIDEBAR */}
        <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaFilter /> Filters</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2">Max Budget (Ksh)</label>
            <input 
              type="range" min="10000" max="200000" step="5000" 
              value={filterPrice} onChange={e => setFilterPrice(e.target.value)}
              className="w-full accent-brand-blue"
            />
            <div className="text-right font-bold text-brand-blue mt-2">Ksh {parseInt(filterPrice).toLocaleString()}</div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2">Location</label>
            <select className="w-full border p-2 rounded bg-white">
              <option>All Locations</option>
              <option>Westlands</option>
              <option>Kilimani</option>
              <option>Karen</option>
            </select>
          </div>
          
          <button className="w-full bg-brand-blue text-white py-2 rounded font-bold hover:bg-blue-900 transition">Apply Filters</button>
        </aside>

        {/* PROPERTY GRID */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.filter(p => p.price <= filterPrice).map((prop) => (
              <div key={prop.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition group">
                <div className="h-48 overflow-hidden relative">
                  <img src={prop.img} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                    <FaStar className="text-yellow-400" /> {prop.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800">{prop.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mb-3"><FaMapMarkerAlt /> {prop.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-blue text-lg">Ksh {prop.price.toLocaleString()}</span>
                    <button 
                      onClick={() => handleBook(prop)}
                      className="bg-gray-900 text-white text-xs px-3 py-2 rounded font-bold hover:bg-black"
                    >
                      Book View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* BOOKING MODAL */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full relative">
            <h2 className="text-2xl font-bold mb-2">Book a Viewing</h2>
            <p className="text-gray-500 mb-6">Schedule a visit to <strong>{selectedProperty.title}</strong></p>
            
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full border p-3 rounded" />
              <input type="text" placeholder="Phone Number" className="w-full border p-3 rounded" />
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Select Date</label>
                <input type="date" className="w-full border p-3 rounded" />
              </div>
              <button onClick={() => setShowModal(false)} className="w-full bg-brand-blue text-white py-3 rounded font-bold mt-2">Confirm Booking</button>
            </form>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;