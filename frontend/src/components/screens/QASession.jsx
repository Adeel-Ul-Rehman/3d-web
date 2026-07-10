import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import StepIndicator from '../common/StepIndicator';
import QuestionCard from '../ui/QuestionCard';
import Footer from '../common/Footer';
import { fetchDynamicQuestions } from '../../services/api.js';

const getFallbackQuestions = (scope = '') => {
  const s = scope.toLowerCase();
  if (s.includes('e-commerce') || s.includes('shop') || s.includes('store')) {
    return [
      { id: 1, text: 'Which specific products/services would you like displayed in 3D?' },
      { id: 2, text: 'Should 3D objects rotate automatically or on user interaction?' },
      { id: 3, text: 'Do you need integration with a contact form, email list, or live chat?' },
    ];
  }
  if (s.includes('real estate') || s.includes('property') || s.includes('house') || s.includes('home')) {
    return [
      { id: 1, text: 'Which specific property details (pricing, area, address) should be highlighted?' },
      { id: 2, text: 'Should 3D walkthrough tours rely on automated paths or user clicks?' },
      { id: 3, text: 'Do you need a lead generation contact form for booking property tours?' },
    ];
  }
  return [
    { id: 1, text: 'What main services, details, or items should the website focus on showcasing?' },
    { id: 2, text: 'Should page animations and 3D effects trigger on scroll or user click?' },
    { id: 3, text: 'Do you need integration with a contact form or call-to-action buttons?' },
  ];
};

const QASession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { template, prompt } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const qList = await fetchDynamicQuestions({ template, prompt });
        setQuestions(qList);
      } catch (err) {
        console.warn('[QASession] Dynamic QA fetch failed, using smart fallback questions:', err);
        const fallbackQs = getFallbackQuestions(prompt?.scope || '');
        setQuestions(fallbackQs);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [template, prompt]);

  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (answer) => {
    // Map answer to the text of the question (rather than just numeric ID)
    // so the code generator can dynamically read the question text context!
    const questionText = questions[currentQuestion].text;
    const updatedAnswers = { ...answers, [questionText]: answer };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
        <Navbar />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow flex items-center justify-center">
          <div className="max-w-md w-full glass-effect rounded-3xl p-8 text-center space-y-6">
            <div className="text-5xl animate-spin inline-block text-primary-500">⚙️</div>
            <div>
              <h2 className="text-lg font-bold text-white">AI is Generating Custom Questions...</h2>
              <p className="text-xs text-gray-500 mt-1">Analyzing your prompt to create tailored interactive details</p>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-dark-800 rounded w-full animate-pulse" />
              <div className="h-4 bg-dark-800 rounded w-5/6 animate-pulse mx-auto" />
              <div className="h-4 bg-dark-800 rounded w-4/5 animate-pulse mx-auto" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
