import fetch from 'node-fetch';
import { CONSTANTS } from '../../utils/constants.js';

export const validateCode = async (html, css, js, originalPrompt) => {
  // Attempt DevToolBox validation
  try {
    const res = await fetch(`${CONSTANTS.DEVTOOLBOX_URL}/fix-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: html, prompt: originalPrompt }),
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      const data = await res.json();
      return parseValidationResult(data);
    }
  } catch (err) {
    console.warn('[Validator] DevToolBox failed:', err.message);
  }

  // Fallback: local structural validation
  return fallbackValidation(html, css, js);
};

const parseValidationResult = (data) => {
  const score = typeof data.quality_score === 'number' ? data.quality_score : calculateBasicScore(data);
  return {
    score: Math.min(Math.max(score, 0), 100),
    issues: data.issues || [],
    suggestions: data.suggestions || [],
    passed: score >= CONSTANTS.QUALITY_THRESHOLD,
  };
};

const calculateBasicScore = (data) => {
  let score = 85;
  if (data.issues?.length) score -= data.issues.length * 5;
  return Math.max(score, 30);
};

const fallbackValidation = (html, css, js) => {
  const issues = [];
  const suggestions = [];

  if (!html.includes('<!DOCTYPE html>')) issues.push('Missing DOCTYPE declaration');
  if (!html.includes('<html')) issues.push('Missing <html> tag');
  if (!html.includes('</html>')) issues.push('Missing closing </html>');
  if (!html.includes('<head>')) issues.push('Missing <head> section');
  if (!html.includes('<meta name="viewport"')) suggestions.push('Add viewport meta tag for mobile');
  if (!html.includes('@media') && !css.includes('@media')) suggestions.push('Add media queries for responsiveness');
  if (html.length < 500) issues.push('Generated code seems too short');

  let score = 100 - issues.length * 8 - suggestions.length * 3;
  score = Math.max(30, Math.min(score, 100));

  return {
    score,
    issues,
    suggestions,
    passed: score >= CONSTANTS.QUALITY_THRESHOLD,
  };
};
