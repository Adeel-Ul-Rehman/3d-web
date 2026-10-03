import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import TemplateCard from '../ui/TemplateCard';
import Footer from '../common/Footer';

const TemplateGallery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const categories = ['All', 'E-Commerce', 'Real Estate', 'Portfolio', 'Business', 'Education'];
  
  const templates = [
    { 
      id: 1, 
      name: '3D Luxury Showroom', 
      category: 'E-Commerce', 
      rating: 5, 
      description: 'Virtual interactive furniture catalog with orbital 3D product viewer and direct pre-order.',
      image: '/templates/showroom.png',
      preview: '/previews/showroom.html',
      accentColor: '#f59e0b',
    },
    { 
      id: 2, 
      name: 'Architectural Gallery', 
      category: 'Real Estate', 
      rating: 5, 
      description: '3D structural property tour layouts with wireframe blueprint visualization.',
      image: '/templates/architecture.png',
      preview: '/previews/architecture.html',
      accentColor: '#3b82f6',
    },
    { 
      id: 3, 
      name: 'Creative Portfolio', 
      category: 'Portfolio', 
      rating: 5, 
      description: 'Floating interactive art museum and project card gallery with icosahedron hero.',
      image: '/templates/portfolio.png',
      preview: '/previews/portfolio.html',
      accentColor: '#8b5cf6',
    },
    { 
      id: 4, 
      name: 'SaaS Corporate Landing', 
      category: 'Business', 
      rating: 4, 
      description: 'Futuristic analytics dashboard with octahedron wireframe hero and metrics strip.',
      image: '/templates/saas.png',
      preview: '/previews/saas.html',
      accentColor: '#6366f1',
    },
    { 
      id: 5, 
      name: 'VR Training Academy', 
      category: 'Education', 
      rating: 5, 
      description: 'Immersive learning platform with orbiting rings, course modules and progress bars.',
      image: '/templates/vr.png',
      preview: '/previews/vr.html',
      accentColor: '#22d3ee',
    },
    { 
      id: 6, 
      name: 'Product Launch Keynote', 
      category: 'Business', 
      rating: 4, 
      description: 'Premium product reveal page with torus-knot hero, AR mode and pricing tiers.',
      image: '/templates/product.png',
      preview: '/previews/product.html',
      accentColor: '#f97316',
    },
  ];


  const filtered = selectedCategory === 'All' ? templates : templates.filter(t => t.category === selectedCategory);

  const handleSelect = (template) => {
    navigate('/prompt', { state: { template } });
  };

  const handleOpenPreview = (template) => {
    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Choose Your Template</h1>
              <p className="text-xs text-gray-400 mt-1">Select a starting point for your AI-generated 3D website</p>
            </div>
            <Button variant="secondary">View All</Button>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-750 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleSelect(template)}
                onPreview={() => handleOpenPreview(template)}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="ghost">Load More Templates...</Button>
          </div>
        </div>
      </main>

      {/* Full screen template preview modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full h-full max-w-6xl bg-dark-950 border border-dark-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800/80 bg-dark-900">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Previewing: {previewTemplate.name}</span>
                  <span className="text-[10px] bg-primary-500/10 text-primary-400 border border-primary-500/25 px-2 py-0.5 rounded font-bold uppercase">
                    3D Ready
                  </span>
                </h2>
                <p className="text-xs text-gray-500">{previewTemplate.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={previewTemplate.preview} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-dark-800 hover:bg-dark-750 text-gray-300 transition-colors"
                >
                  ⛶ Open In New Tab
                </a>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => {
                    handleSelect(previewTemplate);
                    handleClosePreview();
                  }}
                >
                  Select Template
                </Button>
                <button 
                  onClick={handleClosePreview}
                  className="w-9 h-9 rounded-xl border border-dark-700 hover:border-white/20 hover:bg-dark-800 text-gray-400 hover:text-white flex items-center justify-center font-bold text-lg transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Modal Iframe Content */}
            <div className="flex-grow bg-white relative">
              <iframe 
                src={previewTemplate.preview} 
                title={`Preview ${previewTemplate.name}`}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default TemplateGallery;
