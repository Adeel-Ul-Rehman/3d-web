import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import StepIndicator from '../common/StepIndicator';
import UploadArea from '../ui/UploadArea';
import Footer from '../common/Footer';

const AssetUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { template, prompt, answers } = location.state || {};

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = (newFiles) => setFiles(prev => [...prev, ...newFiles]);
  const handleRemove = (index) => setFiles(files.filter((_, i) => i !== index));

  const handleGenerate = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Store payload + files for GenerationProgress to pick up
    sessionStorage.setItem('mf3d_payload', JSON.stringify({
      template: template || {},
      prompt: prompt || {},
      answers: answers || {},
    }));
    window.__mf3dFiles = files;

    navigate('/generating', { replace: false });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/qa', { state: { template, prompt } })}
              className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Q&A
            </button>
          </div>

          <div className="glass-effect rounded-3xl p-6 md:p-10 shadow-xl">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Upload Assets</h1>
              <p className="text-xs text-gray-400 mt-1">Step 3 of 3 · Optional — AI will generate assets if you skip</p>
            </div>

            <StepIndicator currentStep={2} totalSteps={3} labels={['Prompt', 'Q&A', 'Assets']} />

            <div className="mt-8 space-y-6">
              <UploadArea onUpload={handleUpload} />

              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Uploaded Files ({files.length})
                  </h3>
                  <div className="bg-dark-950/40 border border-dark-800 rounded-xl divide-y divide-dark-800">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3">
                        <div className="flex items-center space-x-2.5 truncate">
                          <span className="text-lg">
                            {file.name.match(/\.(glb|gltf|obj|fbx)$/i) ? '📦' :
                             file.name.match(/\.(mp4|webm)$/i) ? '🎥' : '🖼️'}
                          </span>
                          <span className="text-xs font-semibold text-slate-200 truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemove(i)}
                          className="text-xs text-rose-500 hover:text-rose-400 font-bold transition cursor-pointer flex-shrink-0 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  📋 <span className="font-semibold text-blue-300">Pro tip:</span> Upload your brand logos,
                  product photos, or 3D models here. The AI will integrate them seamlessly into your generated website.
                  Missing assets will be synthesized automatically.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-dark-800/40 pt-6">
              <Button variant="ghost" onClick={() => navigate('/qa', { state: { template, prompt } })}>
                ← Previous
              </Button>
              <Button
                variant="success"
                size="lg"
                onClick={handleGenerate}
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Starting...' : '🚀 Generate Website'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AssetUpload;
