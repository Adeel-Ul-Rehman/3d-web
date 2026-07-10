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
  let bestCode = null;
  let bestScore = -1;
  let bestValidation = null;
  const iterationHistory = [];

  while (iteration < maxIterations) {
    iteration++;
    console.log(`[Loop] Iteration ${iteration}/${maxIterations}`);

    const code = await generateCode(currentPrompt, answers);
    const validationResult = await validateCode(code.html, code.css, code.js, enhancedPrompt);

    iterationHistory.push({
      iteration,
      quality: validationResult.score,
      issues: validationResult.issues,
      suggestions: validationResult.suggestions,
    });

    console.log(`[Loop] Quality score: ${validationResult.score}% (threshold: ${threshold}%)`);

    if (validationResult.score > bestScore) {
      bestScore = validationResult.score;
      bestCode = code;
      bestValidation = validationResult;
    }

    if (validationResult.passed) {
      console.log(`[Loop] Quality threshold met at iteration ${iteration}`);
      break;
    }

    // Safety check: if score is extremely low or degrading, break early
    if (iteration >= 2 && validationResult.score < bestScore - 15) {
      console.log(`[Loop] Degradation detected, breaking loop early to prevent hallucination`);
      break;
    }

    if (iteration < maxIterations) {
      const feedback = `
ISSUES FOUND IN PREVIOUS VERSION (Score: ${validationResult.score}%):
${validationResult.issues.map(i => `- ${i}`).join('\n')}

SUGGESTIONS TO IMPROVE:
${validationResult.suggestions.map(s => `- ${s}`).join('\n')}

Please fix all these issues while keeping all original requirements intact.
      `.trim();
      currentPrompt = `${enhancedPrompt}\n\n${feedback}`;
    }
  }

  return {
    html: bestCode.html,
    css: bestCode.css,
    js: bestCode.js,
    quality: bestScore,
    iterations: iteration,
    passed: bestValidation?.passed || false,
    issues: bestValidation?.issues || [],
    suggestions: bestValidation?.suggestions || [],
    iterationHistory,
  };
};
