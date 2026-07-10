import { generateCode } from './codeGenerator.js';
import { validateCode } from './codeValidator.js';

export const loopController = async ({
  enhancedPrompt,
  answers,
  template,
  maxIterations = 3,
  threshold = 85,
}) => {
  let iteration = 0;
  let currentPrompt = enhancedPrompt;
  let code = null;
  let validationResult = null;
  const iterationHistory = [];

  while (iteration < maxIterations) {
    iteration++;
    console.log(`[Loop] Iteration ${iteration}/${maxIterations}`);

    code = await generateCode(currentPrompt, answers);
    validationResult = await validateCode(code.html, code.css, code.js, enhancedPrompt);

    iterationHistory.push({
      iteration,
      quality: validationResult.score,
      issues: validationResult.issues,
      suggestions: validationResult.suggestions,
    });

    console.log(`[Loop] Quality score: ${validationResult.score}% (threshold: ${threshold}%)`);

    if (validationResult.passed) {
      console.log(`[Loop] Quality threshold met at iteration ${iteration}`);
      break;
    }

    if (iteration < maxIterations) {
      const feedback = `
ISSUES FOUND IN PREVIOUS VERSION:
${validationResult.issues.map(i => `- ${i}`).join('\n')}

SUGGESTIONS TO IMPROVE:
${validationResult.suggestions.map(s => `- ${s}`).join('\n')}

Please fix all these issues while keeping all original requirements intact.
      `.trim();
      currentPrompt = `${enhancedPrompt}\n\n${feedback}`;
    }
  }

  return {
    html: code.html,
    css: code.css,
    js: code.js,
    quality: validationResult?.score || 0,
    iterations: iteration,
    passed: validationResult?.passed || false,
    issues: validationResult?.issues || [],
    suggestions: validationResult?.suggestions || [],
    iterationHistory,
  };
};
