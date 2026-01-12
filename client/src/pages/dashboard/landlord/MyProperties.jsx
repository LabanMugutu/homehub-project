import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import api from '../../../api/axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties for THIS landlord
  const fetchMyProperties = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        // Backend Route: /properties/landlord/<id>
        const res = await api.get(`/properties/landlord/${user.id}`);
        setProperties(res.data);
      }
    } catch (error) {
      console.error("Failed to load properties", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this property? This cannot be undone.")) return;

    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter(p => p.id !== id)); // Remove from UI
      alert("Property deleted.");
    } catch (error) {
      alert("Failed to delete property.");
    }
  };

  return (
    <DashboardLayout title="My Properties" role="landlord">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Listings</h2>
        <Link to="/dashboard/landlord/add" className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition shadow">
          <FaPlus /> Add New Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading your properties...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't listed any properties yet.</p>
            <Link to="/dashboard/landlord/add" className="text-brand-blue font-bold hover:underline">Create your first listing</Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="px-6 py-3 font-bold">Property</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold">Price</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map(property => (
                <tr key={property.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={property.image_url || "https://via.placeholder.com/50"} 
                        alt="thumb" 
                        className="w-12 h-12 rounded object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-gray-800">{property.title}</p>
                        <p className="text-xs text-gray-500">{property.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${property.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    KES {property.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link to={`/properties/${property.id}`} className="p-2 text-gray-500 hover:text-brand-blue" title="View">
                      <FaEye />
                    </Link>
                    <button onClick={() => handleDelete(property.id)} className="p-2 text-red-400 hover:text-red-600" title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProperties;