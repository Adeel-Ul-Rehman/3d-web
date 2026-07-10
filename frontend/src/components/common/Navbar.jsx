import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = ({ showAuth = true }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-dark-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
              <span className="text-white font-bold text-sm">3D</span>
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              MobileFirst3D
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            {showAuth ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Profile</Button>
                <Link to="/">
                  <Button variant="primary" size="sm">Logout</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
