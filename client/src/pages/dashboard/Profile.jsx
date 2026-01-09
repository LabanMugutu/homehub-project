import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FaEdit, FaSave, FaCamera, FaTimes, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Initialize state from Local Storage (what we saved during Login)
  const [user, setUser] = useState({
    name: localStorage.getItem('userName') || "Guest User",
    email: localStorage.getItem('userEmail') || "user@example.com",
    role: localStorage.getItem('userRole') || "Tenant", // Falls back to Tenant if missing
    phone: "0700 000 000", // Phone isn't in login data yet, so this remains mock
    gender: "Not Specified",
    dob: "2000-01-01",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update Local Storage so the changes stick even if you refresh
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    alert("Profile updated successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, image: imageUrl });
    }
  };

  return (
    <DashboardLayout title="My Profile" role={user.role}>
      <div className="max-w-4xl mx-auto">
        
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <FaUser className="text-brand-blue" /> Personal Details
            </h3>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 text-brand-blue font-bold hover:bg-blue-50 px-4 py-2 rounded transition"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="flex items-center gap-2 text-gray-500 font-bold hover:bg-gray-100 px-4 py-2 rounded transition"
                >
                  <FaTimes /> Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="flex items-center gap-2 bg-brand-blue text-white font-bold px-4 py-2 rounded hover:bg-blue-900 transition"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row p-8 gap-10">
            
            {/* LEFT COLUMN: Profile Picture */}
            <div className="flex flex-col items-center md:w-1/3">
              <div className="relative group">
                <img 
                  src={user.image} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg" 
                />
                
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                    <FaCamera className="text-white text-3xl" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mt-4">{user.name}</h2>
              <span className="text-sm font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
                {user.role}
              </span>
            </div>

            {/* RIGHT COLUMN: Editable Form */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* Full Name */}
               <div className="col-span-2">
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                 {isEditing ? (
                   <input type="text" name="name" value={user.name} onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none" />
                 ) : (
                   <p className="font-medium text-lg text-gray-800 border-b border-transparent py-2">{user.name}</p>
                 )}
               </div>

               {/* Email */}
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><FaEnvelope /> Email Address</label>
                 {isEditing ? (
                   <input type="email" name="email" value={user.email} onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none" />
                 ) : (
                   <p className="font-medium text-lg text-gray-800 py-2">{user.email}</p>
                 )}
               </div>

               {/* Phone */}
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><FaPhone /> Phone Number</label>
                 {isEditing ? (
                   <input type="text" name="phone" value={user.phone} onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none" />
                 ) : (
                   <p className="font-medium text-lg text-gray-800 py-2">{user.phone}</p>
                 )}
               </div>

               {/* Date of Birth */}
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date of Birth</label>
                 {isEditing ? (
                   <input type="date" name="dob" value={user.dob} onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-blue outline-none" />
                 ) : (
                   <p className="font-medium text-lg text-gray-800 py-2">{user.dob}</p>
                 )}
               </div>

               {/* Gender */}
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
                 {isEditing ? (
                   <select name="gender" value={user.gender} onChange={handleChange} className="w-full border p-3 rounded bg-white focus:ring-2 focus:ring-brand-blue outline-none">
                     <option>Male</option><option>Female</option><option>Other</option>
                   </select>
                 ) : (
                   <p className="font-medium text-lg text-gray-800 py-2">{user.gender}</p>
                 )}
               </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;