import React from 'react';
import Button from '../common/Button';

const TemplateCard = ({ template, onSelect, onPreview }) => {
  const accent = template.accentColor || '#3b82f6';

  return (
    <div 
      className="glass-effect rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{ '--card-accent': accent }}
    >
      {/* Screenshot / Thumbnail */}
      <div className="aspect-video relative overflow-hidden bg-dark-800">
        {template.image ? (
          <img
            src={template.image}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-750 to-dark-850 flex items-center justify-center">
            <span className="text-5xl opacity-50">🎮</span>
          </div>
        )}
        
        {/* Hover overlay with preview button */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={e => { e.stopPropagation(); onPreview(); }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            🔍 Preview
          </button>
          <button
            onClick={e => { e.stopPropagation(); onSelect(); }}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-white"
            style={{ background: accent }}
          >
            Select →
          </button>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3">
          <span 
            className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
          >
            {template.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-dark-900/90 text-[10px] text-gray-400 font-bold tracking-wider">
          3D
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-sm font-bold text-white leading-tight pr-2">{template.name}</h3>
          <span className="text-xs text-yellow-400 flex-shrink-0">
            {'★'.repeat(template.rating)}{'☆'.repeat(5 - template.rating)}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed min-h-[2.75rem] mb-4">{template.description}</p>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onPreview}
            className="py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-dark-800/60 hover:bg-dark-750 border border-dark-700 hover:border-white/10 transition-all cursor-pointer"
          >
            Preview
          </button>
          <button
            onClick={onSelect}
            className="py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:opacity-90 hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 0 16px ${accent}33` }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
