import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import TemplateCard from '../ui/TemplateCard';
import Footer from '../common/Footer';

const TemplateGallery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'E-Commerce', 'Real Estate', 'Portfolio', 'Business', 'Education'];
  
  const templates = [
    { id: 1, name: '3D Luxury Showroom', category: 'E-Commerce', rating: 5, description: 'Virtual interactive furniture catalog and item showroom.' },
    { id: 2, name: 'Architectural Gallery', category: 'Real Estate', rating: 5, description: '3D structural property tour layouts and home builders.' },
    { id: 3, name: 'Creative Portfolio', category: 'Portfolio', rating: 5, description: 'Floating interactive art museum and card portfolio.' },
    { id: 4, name: 'SaaS Corporate Landing', category: 'Business', rating: 4, description: 'Futuristic technical dashboard landing page.' },
    { id: 5, name: 'VR Training Academy', category: 'Education', rating: 5, description: 'Interactive learning models with orbital rotators.' },
    { id: 6, name: 'Product Launch Keynote', category: 'Business', rating: 4, description: 'Immersive sliding promotional product showcase.' },
  ];

  const filtered = selectedCategory === 'All' ? templates : templates.filter(t => t.category === selectedCategory);

  const handleSelect = (template) => {
    navigate('/prompt', { state: { template } });
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
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="ghost">Load More Templates...</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TemplateGallery;
