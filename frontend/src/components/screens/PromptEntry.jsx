import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import Input from '../common/Input';
import StepIndicator from '../common/StepIndicator';
import Footer from '../common/Footer';

const PromptEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template || { name: 'Selected Template' };

  const [formData, setFormData] = useState({
    scope: '',
    motive: '',
    boundaries: '',
    style: '',
    pages: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const nextErrors = {};
    if (!formData.scope.trim()) nextErrors.scope = 'Scope field is required.';
    if (!formData.motive.trim()) nextErrors.motive = 'Motive field is required.';
    if (!formData.boundaries.trim()) nextErrors.boundaries = 'Boundaries field is required.';
    if (!formData.style.trim()) nextErrors.style = 'Style preferences field is required.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      navigate('/qa', { state: { template, prompt: formData } });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/templates')}
              className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Templates
            </button>
          </div>

          <div className="glass-effect rounded-3xl p-6 md:p-10 shadow-xl">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Describe Your Website</h1>
              <p className="text-xs text-gray-400 mt-1">Step 1 of 3 · Template: <span className="text-primary-400 font-semibold">{template.name}</span></p>
            </div>

            <StepIndicator currentStep={0} totalSteps={3} labels={['Prompt', 'Q&A', 'Assets']} />

            <div className="mt-8 space-y-6">
              <Input
                label="Scope"
                placeholder="E-commerce showroom, Luxury Real Estate, Creative portfolio..."
                name="scope"
                value={formData.scope}
                onChange={handleChange}
                error={errors.scope}
                helper="What kind of website are you building?"
              />

              <Input
                label="Motive"
                placeholder="Sell designer chairs, showcase digital artwork, generate housing leads..."
                name="motive"
                value={formData.motive}
                onChange={handleChange}
                error={errors.motive}
                helper="What's the main goal of your website?"
              />

              <Input
                label="Boundaries"
                placeholder="Dark theme, Y-axis orbital mesh controls, mobile layout..."
                name="boundaries"
                value={formData.boundaries}
                onChange={handleChange}
                error={errors.boundaries}
                helper="Any specific limitations or structural requirements?"
              />

              <Input
                label="Style Preferences"
                placeholder="Minimalist charcoal dark, neon borders, smooth rotation..."
                name="style"
                value={formData.style}
                onChange={handleChange}
                error={errors.style}
                helper="Colors, typography theme, mood, vibe"
              />

              <Input
                label="Pages (Optional)"
                placeholder="e.g. 5 (AI will automatically decide if left empty)"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                helper="How many pages? Leave empty for automatic determination."
              />

              <div className="bg-dark-800/20 rounded-xl p-4 border border-dark-700">
                <p className="text-xs text-gray-400">
                  💡 <span className="font-semibold text-gray-300">Tip:</span> Be specific about color palettes and interactive details! This helps AI structure better WebGL loaders.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button variant="primary" size="lg" onClick={handleNext}>
                Next Step →
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PromptEntry;
