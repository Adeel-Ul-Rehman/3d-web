import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/screens/Landing';
import TemplateGallery from './components/screens/TemplateGallery';
import PromptEntry from './components/screens/PromptEntry';
import QASession from './components/screens/QASession';
import AssetUpload from './components/screens/AssetUpload';
import GenerationProgress from './components/screens/GenerationProgress';
import PreviewDelivery from './components/screens/PreviewDelivery';
import Dashboard from './components/screens/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/prompt" element={<PromptEntry />} />
          <Route path="/qa" element={<QASession />} />
          <Route path="/assets" element={<AssetUpload />} />
          <Route path="/generating" element={<GenerationProgress />} />
          <Route path="/preview" element={<PreviewDelivery />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
