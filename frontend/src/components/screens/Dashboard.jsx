import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import ProjectCard from '../ui/ProjectCard';
import Footer from '../common/Footer';
import { fetchProjects, deleteProject, checkHealth } from '../../services/api.js';

const MOCK_PROJECTS = [
  { id: 'demo-1', name: 'Luxury Furniture Showroom', category: 'E-Commerce', date: '2026-07-10', score: 96, thumbnail: '🛒' },
  { id: 'demo-2', name: 'Modern House Property', category: 'Real Estate', date: '2026-07-09', score: 87, thumbnail: '🏠' },
  { id: 'demo-3', name: 'Creative Design Portfolio', category: 'Portfolio', date: '2026-07-08', score: 92, thumbnail: '🎨' },
];

const Dashboard = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(null);
  const [error, setError] = useState('');

  const filters = ['All', 'Recent'];

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Check health first
      await checkHealth();
      setBackendOnline(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setBackendOnline(false);
      setError(err.message);
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('[Dashboard] Delete failed:', err.message);
    }
  };

  const displayProjects = filter === 'Recent'
    ? [...projects].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
    : projects;

  const avgScore = projects.length
    ? Math.round(projects.reduce((s, p) => s + (p.score || 0), 0) / projects.length)
    : 0;

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar showAuth={false} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard</h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${backendOnline === null ? 'bg-gray-500' : backendOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                {backendOnline === null ? 'Connecting...' : backendOnline ? 'Backend online' : 'Backend offline · showing demo data'}
                {!loading && ` · ${projects.length} project${projects.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={loadProjects} className="text-xs">
                ↻ Refresh
              </Button>
              <Link to="/templates">
                <Button variant="primary">+ New Project</Button>
              </Link>
            </div>
          </div>

          {/* Stats row */}
          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Projects', value: projects.length, icon: '📁' },
                { label: 'Avg Quality', value: `${avgScore}%`, icon: '⭐' },
                { label: 'Latest Score', value: `${projects[0]?.score || 0}%`, icon: '🏆' },
              ].map((stat, i) => (
                <div key={i} className="glass-effect rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-extrabold text-white">{stat.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filter pills */}
          <div className="flex gap-2 mb-6">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-750 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-effect rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-dark-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-dark-700 rounded w-3/4" />
                    <div className="h-3 bg-dark-700 rounded w-1/2" />
                    <div className="h-3 bg-dark-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayProjects.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
              <p className="text-gray-500 text-sm mb-8">Create your first AI-powered 3D website in minutes</p>
              <Link to="/templates">
                <Button variant="primary" size="lg">Start Building →</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => handleDelete(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
