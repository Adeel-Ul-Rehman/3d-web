import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import Footer from '../common/Footer';
import { generateWebsite } from '../../services/api.js';

const STEPS = [
  { label: 'Initializing AI pipeline...', icon: '🧠' },
  { label: 'Enhancing prompt with HuggingFace AI...', icon: '✨' },
  { label: 'Processing your Q&A refinements...', icon: '💬' },
  { label: 'Generating website code (attempt 1)...', icon: '⚙️' },
  { label: 'Running quality validation loop...', icon: '🔍' },
  { label: 'Packaging files & creating ZIP...', icon: '📦' },
];

const GenerationProgress = () => {
  const navigate = useNavigate();
  const hasFired = useRef(false);

  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [stepStatuses, setStepStatuses] = useState(STEPS.map(() => 'pending'));
  const [statusText, setStatusText] = useState('Starting...');
  const [error, setError] = useState('');
  const [qualityScore, setQualityScore] = useState(null);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    runPipeline();
  }, []);

  const animateTo = (target) =>
    new Promise(resolve => {
      const tick = () => {
        setProgress(prev => {
          const next = Math.min(prev + 0.6, target);
          if (next < target) requestAnimationFrame(tick);
          else resolve();
          return next;
        });
      };
      requestAnimationFrame(tick);
    });

  const advanceStep = async (index, targetPercent) => {
    setActiveStep(index);
    setStepStatuses(prev => {
      const s = [...prev]; s[index] = 'active'; return s;
    });
    setStatusText(STEPS[index].label);
    await animateTo(targetPercent);
    setStepStatuses(prev => {
      const s = [...prev]; s[index] = 'done'; return s;
    });
    await new Promise(r => setTimeout(r, 180));
  };

  const runPipeline = async () => {
    try {
      const raw = sessionStorage.getItem('mf3d_payload');
      if (!raw) {
        setError('No generation data found. Please start from the template selection.');
        return;
      }
      const payload = JSON.parse(raw);
      const files = window.__mf3dFiles || [];

      // Simulate first 3 steps while API call runs
      const apiPromise = generateWebsite({
        template: payload.template,
        prompt: payload.prompt,
        answers: payload.answers,
        files,
      });

      // Steps 0-2: ~35% in parallel with API
      await advanceStep(0, 8);
      await advanceStep(1, 20);
      await advanceStep(2, 35);

      // Wait for API (steps 3-4 simulate generation loop)
      await advanceStep(3, 55);
      await advanceStep(4, 78);

      // Wait for actual result
      const result = await apiPromise;

      setQualityScore(result.quality);

      // Update step 3 label if multiple iterations
      if (result.iterations > 1) {
        setStatusText(`Validation loop completed in ${result.iterations} iterations`);
      }

      await advanceStep(5, 100);
      setStepStatuses(STEPS.map(() => 'done'));

      sessionStorage.removeItem('mf3d_payload');
      window.__mf3dFiles = null;

      await new Promise(r => setTimeout(r, 700));

      navigate('/preview', {
        state: {
          projectId: result.projectId,
          quality: result.quality,
          iterations: result.iterations,
          issues: result.issues,
          suggestions: result.suggestions,
          iterationHistory: result.iterationHistory,
          previewUrl: result.previewUrl,
          downloadUrl: result.downloadUrl,
          project: result.project,
        },
      });
    } catch (err) {
      console.error('[GenerationProgress]', err);
      setError(err.message || 'An unexpected error occurred during generation.');
      setStatusText('Generation failed');
    }
  };

  const statusIcon = (status) => {
    if (status === 'done') return <span className="text-green-400 text-sm">✓</span>;
    if (status === 'active') return <span className="text-primary-400 text-sm animate-spin inline-block">◌</span>;
    return <span className="text-gray-700 text-sm">○</span>;
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar showAuth={false} />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full glass-effect rounded-3xl p-8 md:p-12 text-center shadow-2xl">

          {/* Icon + title */}
          <div className="mb-8">
            <div className={`text-6xl mb-4 ${error ? '' : 'animate-pulse'}`}>
              {error ? '❌' : STEPS[activeStep]?.icon || '🚀'}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {error ? 'Generation Failed' : 'Generating Your Website'}
            </h1>
            <p className="text-sm text-gray-400 mt-1 min-h-[1.5rem]">
              {error ? error : statusText}
            </p>
          </div>

          {!error && (
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="text-left">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Pipeline Progress</span>
                  <span className="font-bold text-primary-400">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-dark-950 border border-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)',
                    }}
                  />
                </div>
              </div>

              {/* Step list */}
              <div className="bg-dark-950/30 border border-dark-800/50 rounded-2xl p-5 text-left space-y-3">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {statusIcon(stepStatuses[i])}
                    <span className={`text-sm transition-all ${
                      stepStatuses[i] === 'done' ? 'text-gray-500 line-through' :
                      stepStatuses[i] === 'active' ? 'text-white font-semibold' :
                      'text-gray-700'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {qualityScore !== null && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                  <p className="text-sm text-green-400 font-semibold">
                    ✅ Quality Score: {qualityScore}% — Packaging & redirecting...
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-dark-800/40">
            {error ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={() => navigate('/assets')}>
                  ← Try Again
                </Button>
                <Button variant="ghost" onClick={() => navigate('/templates')}>
                  Start Over
                </Button>
              </div>
            ) : (
              <p className="text-xs text-gray-600">
                This usually takes 10–30 seconds. Please don't close this tab.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GenerationProgress;
