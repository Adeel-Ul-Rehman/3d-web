import React from 'react';

const StepIndicator = ({ currentStep, totalSteps = 3, labels = ['Prompt', 'Q&A', 'Assets'] }) => {
  return (
    <div className="w-full max-w-xl mx-auto py-2 mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-dark-800 -z-0">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        
        {/* Steps */}
        {labels.slice(0, totalSteps).map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={index} className="relative flex flex-col items-center z-10">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-primary-500 to-blue-500 border-transparent text-white shadow-lg shadow-primary-500/20' 
                    : isActive 
                    ? 'bg-dark-900 border-primary-500 text-primary-400 ring-4 ring-primary-500/10' 
                    : 'bg-dark-800 border-dark-700 text-gray-500'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                isActive ? 'text-primary-400 font-extrabold' : isCompleted ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
