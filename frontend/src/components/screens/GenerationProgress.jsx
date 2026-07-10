import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import Footer from '../common/Footer';

const GenerationProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const steps = [
    'Enhancing prompt...',
    'Processing Q&A answers...',
    'Generating 3D assets...',
    'Generating website code...',
    'Validation loop (Iteration 1/3)...',
    'Quality check...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/preview', { state: stateData }), 500);
          return 100;
        }
        const newProgress = prev + Math.random() * 3 + 0.5;
        setStep(Math.min(Math.floor(newProgress / 17), steps.length - 1));
        return Math.min(newProgress, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [navigate, stateData]);

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar showAuth={false} />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full glass-effect rounded-3xl p-8 md:p-10 text-center shadow-2xl">
          <div className="mb-8">
            <div className="text-5xl mb-4 animate-bounce">🚀</div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Your Website is Being Created...</h1>
            <p className="text-xs text-gray-400 mt-1">This will take about 10-15 seconds for synthesis</p>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <div className="h-2.5 bg-dark-950 border border-dark-850 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-400 mt-2 block">{Math.round(progress)}% Complete</span>
            </div>
            
            <div className="space-y-3 text-left bg-dark-950/20 border border-dark-800/60 p-6 rounded-2xl">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <span className={`text-sm ${i < step ? 'text-green-400' : i === step ? 'text-primary-400' : 'text-gray-700'}`}>
                    {i < step ? '✅' : i === step ? '⏳' : '○'}
                  </span>
                  <span className={`text-xs ${i < step ? 'text-gray-400' : i === step ? 'text-gray-100 font-bold' : 'text-gray-700 font-medium'}`}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center border-t border-dark-800/40 pt-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-red-400 font-bold"
              onClick={() => navigate('/templates')}
            >
              Cancel Generation
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GenerationProgress;
