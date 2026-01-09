import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, imageSrc, title, subtitle }) => {
  return (
    <div className="flex h-screen w-full bg-white">
      <div className="hidden lg:flex w-1/2 relative bg-brand-blue overflow-hidden">
        <img src={imageSrc} alt="Building" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute bottom-20 left-10 text-white z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg opacity-90">{subtitle}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 to-transparent"></div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="text-2xl font-bold text-brand-blue">🏠 HomeHub</Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;