import { runGenerationPipeline } from '../services/aiPipeline/orchestrator.js';
import { createProject } from '../models/projectModel.js';

export const generateWebsite = async (req, res, next) => {
  try {
    const { template, prompt, answers } = req.body;
    const files = req.files || [];

    if (!prompt) {
      const err = new Error('Prompt data is required.');
      err.statusCode = 400;
      err.isFriendly = true;
      return next(err);
    }

    const parsedPrompt = typeof prompt === 'string' ? JSON.parse(prompt) : prompt;
    const parsedAnswers = typeof answers === 'string' ? JSON.parse(answers) : (answers || {});

    console.log('[GenerationController] Starting pipeline for:', parsedPrompt.scope);

    const result = await runGenerationPipeline({
      template: template || 'default',
      prompt: parsedPrompt,
      answers: parsedAnswers,
      files: files.map(f => ({
        filename: f.originalname,
        buffer: f.buffer,
        mimetype: f.mimetype,
        size: f.size,
      })),
    });

    const thumbnailMap = {
      'E-Commerce': '🛒', 'Real Estate': '🏠', 'Portfolio': '🎨',
      'Business': '💼', 'Education': '📚', 'Restaurant': '🍽️',
    };
    const category = parsedPrompt.scope || 'General';
    const thumbnail = Object.entries(thumbnailMap).find(([k]) =>
      category.toLowerCase().includes(k.toLowerCase())
    )?.[1] || '🚀';

    const project = createProject({
      id: result.projectId,
      name: parsedPrompt.scope || 'My Website',
      category,
      score: result.quality || 0,
      thumbnail,
      previewUrl: `/api/preview/${result.projectId}`,
      downloadUrl: `/api/download/${result.projectId}`,
      iterations: result.iterations,
      issues: result.issues,
    });

    res.status(200).json({
      success: true,
      projectId: result.projectId,
      quality: result.quality,
      iterations: result.iterations,
      issues: result.issues,
      suggestions: result.suggestions,
      iterationHistory: result.iterationHistory,
      previewUrl: `/api/preview/${result.projectId}`,
      downloadUrl: `/api/download/${result.projectId}`,
      project,
    });
  } catch (error) {
    next(error);
  }
};
