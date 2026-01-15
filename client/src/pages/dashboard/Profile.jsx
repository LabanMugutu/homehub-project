import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import UploadWidget from '../../components/UploadWidget'; // Import the new widget
import api from '../../api/axios'; // Use our API connector
import { FaEdit, FaSave, FaUser, FaEnvelope, FaPhone, FaIdCard, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize state
  const [user, setUser] = useState({
    name: localStorage.getItem('userName') || "User",
    email: localStorage.getItem('userEmail') || "",
    role: localStorage.getItem('userRole') || "Tenant",
    phone: "",
    id_document: "", // Stores the URL of the uploaded ID
    verification_status: "pending" // pending, verified, rejected
  });

  // Fetch real profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile'); // Assuming backend has this endpoint
        if(res.data) setUser(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Image Upload from Widget
  const handleIDUpload = (url) => {
    setUser(prev => ({ ...prev, id_document: url }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Send update to backend
      await api.put('/users/profile', user);
      
      localStorage.setItem('userName', user.name); // Update local storage
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to show status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaCheckCircle /> Verified</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaTimesCircle /> Rejected</span>;
      default: // pending or unverified
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaHourglassHalf /> Verification Pending</span>;
    }
  };

  return (
    <DashboardLayout title="My Profile" role={user.role}>
      <div className="max-w-4xl mx-auto">
        
        {/* Verification Alert (Only for Landlords) */}
        {user.role === 'landlord' && user.verification_status !== 'verified' && (
          <div className="bg-blue-50 border-l-4 border-brand-blue p-4 mb-6 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaIdCard className="h-5 w-5 text-brand-blue" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-bold">Identity Verification Required.</span> 
                  To list properties, please upload your National ID or Passport below.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <h3 className="font-bold text-gray-700 flex items-center gap-2"><FaUser className="text-brand-blue" /> Personal Details</h3>
               {user.role === 'landlord' && renderStatusBadge(user.verification_status)}
            </div>
            
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-brand-blue font-bold hover:bg-blue-50 px-4 py-2 rounded transition flex items-center gap-2">
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="text-gray-500 font-bold hover:bg-gray-100 px-4 py-2 rounded">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="bg-brand-blue text-white font-bold px-4 py-2 rounded hover:bg-blue-900 transition">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row p-8 gap-10">
            {/* ... (Existing Profile Picture Logic goes here) ... */}
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Basic Fields */}
               <div className="col-span-2">
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                 {isEditing ? <input type="text" name="name" value={user.name} onChange={handleChange} className="w-full border p-3 rounded" /> : <p className="font-medium text-lg border-b border-transparent py-2">{user.name}</p>}
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                 <p className="font-medium text-lg text-gray-600 py-2">{user.email}</p>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</label>
                 {isEditing ? <input type="text" name="phone" value={user.phone} onChange={handleChange} className="w-full border p-3 rounded" /> : <p className="font-medium text-lg py-2">{user.phone || "Not Set"}</p>}
               </div>

               {/* --- NEW SECTION: ID Upload (Only visible to Landlords in Edit Mode) --- */}
               {user.role === 'landlord' && (
                 <div className="col-span-2 border-t border-gray-100 pt-6 mt-2">
                   <label className="flex text-sm font-bold text-gray-800 uppercase mb-2 items-center gap-2">
                     <FaIdCard /> Identity Document
                   </label>
                   
                   {user.id_document ? (
                     <div className="flex items-center gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                       <a href={user.id_document} target="_blank" rel="noopener noreferrer" className="text-brand-blue font-bold hover:underline truncate">
                         View Uploaded Document
                       </a>
                       {isEditing && (
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">or replace:</span>
                            <UploadWidget onUpload={handleIDUpload} buttonText="Upload New ID" />
                         </div>
                       )}
                     </div>
                   ) : (
                     isEditing ? (
                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                         <p className="text-sm text-gray-500 mb-3">Upload a clear photo of your National ID or Passport.</p>
                         <div className="flex justify-center"><UploadWidget onUpload={handleIDUpload} buttonText="Select Document" /></div>
                       </div>
                     ) : (
                       <p className="text-red-500 italic text-sm">No ID uploaded yet.</p>
                     )
                   )}
                 </div>
               )}

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;