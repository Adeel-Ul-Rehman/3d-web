import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import MetricCard from '../ui/MetricCard';
import Footer from '../common/Footer';
import { getPreviewUrl, getDownloadUrl } from '../../services/api.js';

const PreviewDelivery = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    projectId,
    quality = 0,
    iterations = 1,
    issues = [],
    suggestions = [],
    iterationHistory = [],
    project,
  } = location.state || {};

  const [copyStatus, setCopyStatus] = useState('');
  const [saved, setSaved] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const previewUrl = projectId ? getPreviewUrl(projectId) : null;
  const downloadUrl = projectId ? getDownloadUrl(projectId) : null;

  // Quality display helpers
  const qualityColor = quality >= 90 ? 'text-green-400' : quality >= 75 ? 'text-yellow-400' : 'text-rose-400';
  const qualityLabel = quality >= 90 ? '🏆 Excellent' : quality >= 75 ? '✅ Good' : '⚠️ Fair';
  const estimatedFps = Math.round(28 + (quality / 100) * 32);
  const estimatedLoad = (3.5 - (quality / 100) * 2.2).toFixed(1);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${projectId}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyUrl = () => {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl).then(() => {
      setCopyStatus('✓ Copied!');
      setTimeout(() => setCopyStatus(''), 2500);
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => navigate('/dashboard'), 900);
  };

  if (!projectId) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-6">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-white text-xl font-bold">No project to preview</h2>
        <p className="text-gray-400 text-sm">Generate a website first to see the preview here.</p>
        <Link to="/templates"><Button variant="primary">Start Generating →</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar showAuth={false} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ── Top Banner ── */}
          <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-green-400">✅ Website Generated!</h1>
                <p className="text-xs text-gray-400 mt-1">
                  Project: <span className="font-mono text-white font-bold">{projectId}</span>
                  {' · '}{iterations} iteration{iterations !== 1 ? 's' : ''}
                  {' · '}{qualityLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopyUrl}>
                  {copyStatus || '📋 Copy URL'}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDownload}>
                  📦 Download ZIP
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  {saved ? '✓ Saved!' : '💾 Save to Dashboard'}
                </Button>
              </div>
            </div>
          </div>

          {/* ── Live Preview iframe ── */}
          <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-800/50 bg-dark-950/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 bg-dark-800 rounded-md px-3 py-1 text-[11px] font-mono text-gray-400 truncate">
                {previewUrl}
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-gray-500 hover:text-white transition font-medium flex-shrink-0"
              >
                ⛶ Full Screen
              </a>
            </div>

            {/* iframe */}
            {iframeError ? (
              <div className="flex flex-col items-center justify-center py-20 bg-dark-850">
                <div className="text-4xl mb-3">🔗</div>
                <p className="text-gray-400 text-sm mb-3">iframe blocked by browser security.</p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 text-sm underline hover:text-primary-300"
                >
                  Open in new tab →
                </a>
              </div>
            ) : (
              <iframe
                src={previewUrl}
                title="Generated Website Preview"
                className="w-full"
                style={{ height: '540px', border: 'none' }}
                sandbox="allow-scripts allow-same-origin allow-forms"
                onError={() => setIframeError(true)}
              />
            )}

            {/* Footer bar */}
            <div className="flex justify-between items-center px-5 py-3 border-t border-dark-800/40 bg-dark-950/40">
              <span className="text-xs text-gray-500">Live preview · Powered by MobileFirst3D</span>
              <Link to="/prompt" state={{ template: { name: project?.name || 'My Site' } }}>
                <Button variant="ghost" size="sm" className="text-xs">✏️ Edit & Regenerate</Button>
              </Link>
            </div>
          </div>

          {/* ── Quality Metrics ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard label="Quality Score" value={`${quality}%`} status={qualityLabel.split(' ')[0]} color={qualityColor} />
            <MetricCard label="Est. FPS" value={`${estimatedFps}`} status="⚡" color="text-blue-400" />
            <MetricCard label="Est. Load" value={`${estimatedLoad}s`} status="🚀" color="text-emerald-400" />
            <MetricCard label="Iterations" value={`${iterations}/3`} status="🔄" color="text-purple-400" />
          </div>

          {/* ── AI Validation Report ── */}
          {(issues.length > 0 || suggestions.length > 0) && (
            <div className="glass-effect rounded-3xl p-6 md:p-8">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5">🔍 AI Validation Report</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {issues.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">Issues Found</p>
                    <ul className="space-y-2">
                      {issues.map((issue, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-rose-400 mt-0.5 flex-shrink-0">•</span>{issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Suggestions</p>
                    <ul className="space-y-2">
                      {suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Iteration history */}
              {iterationHistory.length > 1 && (
                <div className="mt-5 pt-5 border-t border-dark-800/40">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Iteration History</p>
                  <div className="flex gap-3 flex-wrap">
                    {iterationHistory.map((it) => (
                      <div key={it.iteration} className="bg-dark-800 rounded-xl px-4 py-2 text-center">
                        <p className="text-xs text-gray-500">Run {it.iteration}</p>
                        <p className={`text-sm font-bold ${it.quality >= 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {it.quality}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Delivery Options ── */}
          <div className="glass-effect rounded-3xl p-6 md:p-8">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5">📋 Delivery Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleCopyUrl}
                className="flex flex-col items-center gap-2 p-5 bg-dark-800/60 border border-dark-700 hover:border-primary-500/50 rounded-2xl transition group cursor-pointer"
              >
                <span className="text-2xl">📋</span>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white">{copyStatus || 'Copy Preview URL'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex flex-col items-center gap-2 p-5 bg-dark-800/60 border border-dark-700 hover:border-emerald-500/50 rounded-2xl transition group cursor-pointer"
              >
                <span className="text-2xl">📦</span>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white">Download ZIP Bundle</span>
              </button>
              <button
                onClick={handleSave}
                className="flex flex-col items-center gap-2 p-5 bg-dark-800/60 border border-dark-700 hover:border-purple-500/50 rounded-2xl transition group cursor-pointer"
              >
                <span className="text-2xl">💾</span>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white">{saved ? '✓ Saved!' : 'Save to Dashboard'}</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-4 text-center">
              ZIP includes fully compiled HTML, embedded CSS & JavaScript, and all 3D assets.
            </p>
          </div>

          {/* ── Bottom Actions ── */}
          <div className="flex flex-wrap justify-center gap-4 pb-4">
            <Button variant="secondary" onClick={handleSave}>
              💾 Save to Dashboard
            </Button>
            <Link to="/templates">
              <Button variant="primary">✨ Start New Project</Button>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PreviewDelivery;
