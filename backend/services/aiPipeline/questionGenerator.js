import { HfInference } from '@huggingface/inference';

let hfClient = null;

const getHFClient = () => {
  if (!hfClient && process.env.HUGGINGFACE_API_KEY) {
    hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }
  return hfClient;
};

export const generateDynamicQuestions = async (promptData) => {
  const { scope, motive, boundaries, style } = promptData;

  const hf = getHFClient();
  if (hf) {
    try {
      const inputs = `Based on these website specifications, write exactly 3 high-quality, specific questions to ask the user to help refine the interactive 3D layout, styling, and functionality of their website.
Website Details:
Scope: ${scope}
Motive: ${motive}
Boundaries: ${boundaries}
Style: ${style}

Output only the questions as a JSON array of strings, e.g. ["Question 1", "Question 2", "Question 3"]. Do not include any explanation or other text.`;

      const result = await hf.textGeneration({
        model: process.env.HUGGINGFACE_MODEL || 'gpt2',
        inputs,
        parameters: { max_new_tokens: 150, temperature: 0.5 },
      });

      const text = result.generated_text;
      const jsonMatch = text.match(/\[\s*"[\s\S]*?"\s*\]/);
      if (jsonMatch) {
        const arr = JSON.parse(jsonMatch[0]);
        if (Array.isArray(arr) && arr.length >= 3) {
          return arr.slice(0, 3).map((q, i) => ({ id: i + 1, text: q }));
        }
      }
    } catch (err) {
      console.warn('[QuestionGen] HuggingFace question generation failed, using fallback:', err.message);
    }
  }

  // Smart Context-Aware Fallback
  return generateFallbackQuestions(promptData);
};

const generateFallbackQuestions = (promptData) => {
  const { scope = '', motive = '', boundaries = '', style = '' } = promptData;
  const sLower = scope.toLowerCase();
  const bLower = boundaries.toLowerCase();
  const stLower = style.toLowerCase();

  const questions = [];

  // Question 1: Focused on assets/content type
  if (sLower.includes('e-commerce') || sLower.includes('shop') || sLower.includes('store')) {
    questions.push({ id: 1, text: `Which specific product lines or categories (related to: ${motive || 'items'}) should we showcase first?` });
  } else if (sLower.includes('real estate') || sLower.includes('property') || sLower.includes('house') || sLower.includes('home')) {
    questions.push({ id: 1, text: "Which floorplans, architectural renders, or specific property photos should be highlighted?" });
  } else if (sLower.includes('portfolio') || sLower.includes('creative') || sLower.includes('design')) {
    questions.push({ id: 1, text: "What types of creative work (e.g. 3D models, code samples, graphics) will be displayed in the gallery?" });
  } else {
    questions.push({ id: 1, text: `Which key elements or main features should be emphasized for the goal: "${motive || 'showcasing our services'}"?` });
  }

  // Question 2: Focused on 3D interaction / boundaries
  if (bLower.includes('rotation') || bLower.includes('orbit') || bLower.includes('mesh') || bLower.includes('3d')) {
    questions.push({ id: 2, text: "Should the 3D meshes perform animated auto-rotation, or only respond directly to mouse/touch drag controls?" });
  } else if (bLower.includes('dark') || stLower.includes('dark') || stLower.includes('black')) {
    questions.push({ id: 2, text: "Should we use a rich dark-charcoal glassmorphism look, or a deep pitch-black minimal interface?" });
  } else {
    questions.push({ id: 2, text: "Would you prefer a modern, fluid grid animation layout, or a structured section-by-section scroll?" });
  }

  // Question 3: Focused on Call-To-Action / Integration
  if (motive.includes('sell') || motive.includes('leads') || motive.includes('contact')) {
    questions.push({ id: 3, text: "Do you need a lead capture contact form with automated validation, or a direct link to an external booking system?" });
  } else {
    questions.push({ id: 3, text: "What primary action should visitors take? (e.g., fill a contact form, subscribe to newsletter, or visit socials)" });
  }

  return questions;
};
