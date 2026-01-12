import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">HomeHub</h3>
          <p className="text-gray-400 text-sm">
            Making renting simple, transparent, and secure for everyone in Nairobi.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/marketplace" className="hover:text-white">Browse Homes</a></li>
            <li><a href="/register" className="hover:text-white">Become a Landlord</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>support@homehub.ke</li>
            <li>+254 700 000 000</li>
            <li>Nairobi, Kenya</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} HomeHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;