import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../api/axios'; 
import { Link } from 'react-router-dom'; // <--- IMPORTED LINK
import { FaMapMarkerAlt, FaPlus, FaMoneyBillWave, FaTools, FaCheckCircle, FaExclamationCircle, FaClock, FaSpinner } from 'react-icons/fa';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH REAL DATA
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties'); 
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Could not load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Status Helpers
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-red-100 text-red-600';
      case 'In Progress': return 'bg-yellow-100 text-yellow-600';
      case 'Fixed': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <FaExclamationCircle />;
      case 'In Progress': return <FaClock />;
      case 'Fixed': return <FaCheckCircle />;
      default: return null;
    }
  };

  return (
    <DashboardLayout title="My Properties">
      
      {/* --- HEADER WITH NAVIGATION LINK --- */}
      <div className="flex justify-end mb-6">
        <Link 
          to="/landlord/properties/add" 
          className="bg-brand-blue text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-900 transition shadow-sm"
        >
          <FaPlus /> Add New Property
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FaSpinner className="animate-spin text-4xl mb-4 text-brand-blue" />
          <p>Loading your properties...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && properties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <h3 className="text-xl font-bold text-gray-700">No Properties Found</h3>
          <p className="text-gray-500 mb-4">You haven't listed any properties yet.</p>
          <Link to="/landlord/properties/add" className="text-brand-blue font-bold hover:underline">
            Click here to list your first one
          </Link>
        </div>
      )}

      {/* Real Property Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
            
            <div className="flex h-40">
              <img 
                src={prop.image_url || "https://via.placeholder.com/300x200?text=No+Image"} 
                alt={prop.title} 
                className="w-1/3 object-cover" 
              />
              <div className="w-2/3 p-5 flex flex-col justify-between bg-gray-50">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{prop.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <FaMapMarkerAlt /> {prop.location}
                  </p>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase">Monthly Rent</p>
                   <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                     <FaMoneyBillWave /> Ksh {prop.price ? prop.price.toLocaleString() : '0'}
                   </p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaTools className="text-gray-400" /> Maintenance Status
              </h4>
              
              {prop.issues && prop.issues.length > 0 ? (
                <div className="space-y-2">
                  {prop.issues.map((issue) => (
                    <div key={issue.id} className="flex justify-between items-center text-sm p-2 rounded bg-gray-50 border border-gray-100">
                      <span className="text-gray-700 font-medium">{issue.title}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)} {issue.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No active issues reported.</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
               <button className="text-brand-blue text-sm font-bold hover:underline">View Full Details</button>
            </div>

          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Properties;