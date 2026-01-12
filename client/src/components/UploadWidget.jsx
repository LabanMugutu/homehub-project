import React, { useEffect, useRef } from 'react';

const UploadWidget = ({ onUpload, buttonText = "Upload Image" }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: 'dk5csli4u',
      uploadPreset: 'homehub_preset',
      multiple: false,
      folder: 'homehub_docs',
      clientAllowedFormats: ["png", "jpeg", "jpg", "pdf"],
      maxImageFileSize: 5000000 // 5MB limit
    }, function(error, result) {
      if (!error && result && result.event === "success") {
        console.log("Upload Done! URL:", result.info.secure_url);
        onUpload(result.info.secure_url); // Send URL back to parent
      }
    });
  }, [onUpload]);

  return (
    <button 
      onClick={(e) => {
        e.preventDefault(); // Prevent form submit
        widgetRef.current.open();
      }}
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300 hover:bg-gray-300 transition font-bold text-sm flex items-center gap-2"
    >
      📷 {buttonText}
    </button>
  );
};

export default UploadWidget;