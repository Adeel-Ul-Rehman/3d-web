import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import StepIndicator from '../common/StepIndicator';
import QuestionCard from '../ui/QuestionCard';
import Footer from '../common/Footer';

const questions = [
  { id: 1, text: 'Which specific products/services would you like displayed in 3D?' },
  { id: 2, text: 'Should 3D objects rotate automatically or on user interaction?' },
  { id: 3, text: 'Do you need integration with a contact form, email list, or live chat?' },
];

const QASession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { template, prompt } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (answer) => {
    const updatedAnswers = { ...answers, [questions[currentQuestion].id]: answer };
    setAnswers(updatedAnswers);

    if (!isLastQuestion) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      navigate('/assets', { state: { template, prompt, answers: updatedAnswers } });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      navigate('/prompt', { state: { template } });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>

          <div className="glass-effect rounded-3xl p-6 md:p-10 shadow-xl">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white">AI Questions</h1>
              <p className="text-xs text-gray-400 mt-1">Step 2 of 3 · Help AI understand your interactive features</p>
            </div>

            <StepIndicator currentStep={1} totalSteps={3} labels={['Prompt', 'Q&A', 'Assets']} />

            <div className="mt-8">
              <QuestionCard
                question={questions[currentQuestion]}
                total={questions.length}
                current={currentQuestion + 1}
                isLast={isLastQuestion}
                onAnswer={handleAnswer}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QASession;
