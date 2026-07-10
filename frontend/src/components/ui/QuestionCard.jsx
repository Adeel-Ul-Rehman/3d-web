import React, { useState } from 'react';
import Button from '../common/Button';

const QuestionCard = ({ question, total, current, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question {current} of {total}</span>
        <span className="text-xs font-bold text-gray-400">{Math.round((current / total) * 100)}% Complete</span>
      </div>
      
      <div className="bg-dark-800/40 border border-dark-700/60 rounded-2xl p-6">
        <p className="text-base font-bold text-gray-200">{question.text}</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 hover:border-dark-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button variant="primary" onClick={handleSubmit}>
          Next →
        </Button>
      </div>
      
      <div className="text-center pt-2">
        <button 
          className="text-xs text-gray-500 hover:text-gray-300 font-bold uppercase tracking-wider transition-colors cursor-pointer"
          onClick={() => onAnswer('Not applicable')}
        >
          Skip this question
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
