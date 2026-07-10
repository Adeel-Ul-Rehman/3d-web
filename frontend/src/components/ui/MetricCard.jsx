import React from 'react';

const MetricCard = ({ label, value, status, color = 'text-white' }) => {
  return (
    <div className="glass-effect rounded-2xl p-5 text-center hover:border-dark-500/30 hover:bg-dark-800/40 transition duration-150">
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 tracking-tight ${color}`}>
        {value} <span className="text-xs font-normal text-gray-500">{status}</span>
      </p>
    </div>
  );
};

export default MetricCard;
