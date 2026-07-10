import { enhancePrompt } from './promptEnhancer.js';
import { loopController } from './loopController.js';
import { saveGeneratedFiles } from '../fileService.js';
import { createProjectZip } from '../zipService.js';
import { generateProjectId } from '../../utils/helpers.js';
import { CONSTANTS } from '../../utils/constants.js';

export const runGenerationPipeline = async (userData) => {
  const { template, prompt, answers, files } = userData;

  console.log('[Pipeline] Starting generation pipeline...');

  // Step 1: Enhance Prompt
  console.log('[Pipeline] Step 1: Enhancing prompt...');
  const enhancedPrompt = await enhancePrompt(prompt);

  // Step 2: Generate + Validate loop
  console.log('[Pipeline] Step 2-5: Running generate/validate loop...');
  const result = await loopController({
    enhancedPrompt,
    answers,
    template,
    maxIterations: CONSTANTS.MAX_ITERATIONS,
    threshold: CONSTANTS.QUALITY_THRESHOLD,
  });

  // Step 3: Save generated files
  const projectId = generateProjectId();
  console.log(`[Pipeline] Step 6: Saving files for project ${projectId}...`);
  const projectPath = await saveGeneratedFiles(projectId, {
    html: result.html,
    css: result.css,
    js: result.js,
    assets: (files || []).map(f => ({ filename: f.filename || f.originalname, buffer: f.buffer })),
  });

  // Step 4: Create ZIP archive
  console.log('[Pipeline] Creating ZIP archive...');
  const zipPath = await createProjectZip(projectId);

  console.log('[Pipeline] Complete! Quality:', result.quality);

  return {
    projectId,
    projectPath,
    zipPath,
    html: result.html,
    css: result.css,
    js: result.js,
    quality: result.quality,
    iterations: result.iterations,
    issues: result.issues,
    suggestions: result.suggestions,
    iterationHistory: result.iterationHistory,
    template,
    prompt,
    answers,
  };
};
