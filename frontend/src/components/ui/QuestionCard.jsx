import React, { useState } from 'react';
import Button from '../common/Button';

const QuestionCard = ({ question, total, current, isLast, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleSkip = () => {
    onAnswer('Not applicable');
    setAnswer('');
  };

  const progressPct = Math.round((current / total) * 100);

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Question {current} of {total}
        </span>
        <span className="text-xs font-bold text-gray-400">{progressPct}% Complete</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-dark-800/40 border border-dark-700/60 rounded-2xl p-6">
        <p className="text-base font-bold text-gray-200">{question.text}</p>
      </div>

      {/* Answer input */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-1 px-4 py-3 bg-dark-900 border border-dark-700 hover:border-dark-600 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <Button
          variant={isLast ? 'success' : 'primary'}
          onClick={handleSubmit}
          disabled={!answer.trim()}
        >
          {isLast ? 'All Done →' : 'Next →'}
        </Button>
      </div>

      {/* Skip */}
      <div className="text-center pt-1">
        <button
          className="text-xs text-gray-500 hover:text-gray-300 font-bold uppercase tracking-wider transition-colors cursor-pointer"
          onClick={handleSkip}
        >
          Skip this question
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
