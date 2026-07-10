import React from 'react';

const Input = ({ 
  label, 
  helper, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-dark-900 border rounded-xl text-gray-100 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 ${
          error ? 'border-red-500 focus:ring-red-500/50' : 'border-dark-700 hover:border-dark-650'
        } ${className}`}
        {...props}
      />
      {helper && !error && (
        <p className="text-xs text-gray-500 font-medium">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-400 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default Input;
