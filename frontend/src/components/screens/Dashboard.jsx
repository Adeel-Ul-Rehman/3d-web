import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import ProjectCard from '../ui/ProjectCard';
import Footer from '../common/Footer';

const Dashboard = () => {
  const [filter, setFilter] = useState('All');
  
  const projects = [
    { id: 1, name: 'Luxury Furniture Showroom', category: 'E-Commerce', date: 'Jun 15, 2026', score: 96, thumbnail: '🎮' },
    { id: 2, name: 'Modern House Property', category: 'Real Estate', date: 'Jun 14, 2026', score: 85, thumbnail: '🏠' },
    { id: 3, name: 'Creative Designer Portfolio', category: 'Portfolio', date: 'Jun 13, 2026', score: 92, thumbnail: '🎨' },
  ];

  const filters = ['All', 'Recent', 'Favorites'];

  const filteredProjects = projects; // Simple mock filter fallback

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar showAuth={false} />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard</h1>
              <p className="text-xs text-gray-400 mt-1">Manage and edit your generated 3D websites</p>
            </div>
            <Link to="/templates" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">+ New Project</Button>
            </Link>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-750 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
