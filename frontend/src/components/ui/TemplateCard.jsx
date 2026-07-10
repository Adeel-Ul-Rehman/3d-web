import React from 'react';
import Button from '../common/Button';

const TemplateCard = ({ template, onSelect }) => {
  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover group">
      <div className="aspect-video bg-gradient-to-br from-dark-750 to-dark-850 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
          <div className="w-14 h-14 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <span className="text-2xl">🎮</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-dark-900/90 text-[10px] text-gray-400 font-bold tracking-wider">
          3D PREVIEW
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-bold text-white leading-tight">{template.name}</h3>
          <span className="text-sm text-yellow-400">{"★".repeat(template.rating)}</span>
        </div>
        <p className="text-xs text-indigo-400 font-semibold mb-2">{template.category}</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{template.description}</p>
        <Button variant="primary" size="sm" onClick={onSelect} className="w-full">
          Select Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateCard;
