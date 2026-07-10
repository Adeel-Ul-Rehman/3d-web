import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import Footer from '../common/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex-grow flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-dark-900 to-blue-900/5 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              🚀 AI-Powered 3D Websites
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 text-white">
              Build Stunning{' '}
              <span className="gradient-text bg-gradient-to-r from-primary-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">3D Websites</span>
              <br />
              with AI
            </h1>
            
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Create professional, mobile-optimized 3D websites in minutes. 
              No coding required — just describe what you want and watch AI build it.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto sm:max-w-none">
              <Link to="/templates" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full">
                  Start Building →
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-dark-800/60 max-w-2xl mx-auto">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">15+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Templates</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">30+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">FPS on Mobile</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">2min</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Generation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/20 border-t border-dark-800/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-12 tracking-tight">Why Choose MobileFirst3D?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'AI-Powered Creation', desc: 'Generate high-fidelity components, menus, and sections from plain English prompts.' },
              { icon: '📱', title: 'Mobile-First Layout', desc: 'Pre-optimized viewport physics guaranteeing 30+ frames per second on standard smartphones.' },
              { icon: '⚡', title: 'Lightning Fast Baking', desc: 'Assembles full HTML, tailwind configurations, and webgl shaders in less than 3 minutes.' },
            ].map((feature, i) => (
              <div key={i} className="glass-effect rounded-2xl p-6 text-center card-hover">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
