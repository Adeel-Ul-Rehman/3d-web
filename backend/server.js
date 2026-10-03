import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

// Load env first
dotenv.config();

import generateRoutes from './routes/generate.js';
import previewRoutes from './routes/preview.js';
import downloadRoutes from './routes/download.js';
import projectsRoutes from './routes/projects.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// 🔧 FIX: Remove X-Frame-Options for iframe embedding
// =============================================
app.use((req, res, next) => {
  // Remove the default X-Frame-Options header
  res.removeHeader('X-Frame-Options');
  // Allow iframe embedding from any origin (for development)
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  // Also set CSP to allow framing from your frontend origins
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:5173 http://localhost:3000 http://localhost:5174 http://localhost:5000");
  next();
});
// =============================================

// Ensure directories exist
const GENERATED_PATH = process.env.GENERATED_FILES_PATH || './generated';
const UPLOADS_PATH = process.env.UPLOADS_PATH || './uploads';
await fs.ensureDir(GENERATED_PATH);
await fs.ensureDir(UPLOADS_PATH);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =============================================
// 📁 Serve static files for previews
// =============================================
app.use('/preview', express.static(GENERATED_PATH));

// ✅ FIX: Serve uploaded assets for each project so relative src="assets/..." resolves
// Generated HTML uses: src="assets/logo.png"
// This serves it from: /api/preview/{projectId}/assets/{filename}
app.use('/api/preview/:projectId/assets', (req, res, next) => {
  const { projectId } = req.params;
  const assetDir = path.join(__dirname, GENERATED_PATH, projectId, 'assets');
  express.static(assetDir)(req, res, next);
});

// Routes
app.use('/api/generate', generateRoutes);
app.use('/api/preview', previewRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/projects', projectsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'MobileFirst3D Backend is fully operational!',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    pipeline: {
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
      maxIterations: process.env.MAX_ITERATIONS || 3,
      qualityThreshold: process.env.QUALITY_THRESHOLD || 85,
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 MobileFirst3D Backend running on http://localhost:${PORT}`);
  console.log(`📁 Generated files: ${GENERATED_PATH}`);
  console.log(`📁 Uploads: ${UPLOADS_PATH}`);
  console.log(`🤖 HuggingFace: ${process.env.HUGGINGFACE_API_KEY ? '✅ Connected' : '❌ No API key'}`);
});