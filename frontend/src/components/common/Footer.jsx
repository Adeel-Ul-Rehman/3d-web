import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-dark-800/40 bg-dark-900/60 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            © 2026 MobileFirst3D. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">About</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Features</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
