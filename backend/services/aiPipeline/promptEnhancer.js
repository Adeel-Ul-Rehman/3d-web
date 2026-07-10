import { HfInference } from '@huggingface/inference';

let hfClient = null;

const getHFClient = () => {
  if (!hfClient && process.env.HUGGINGFACE_API_KEY) {
    hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }
  return hfClient;
};

export const enhancePrompt = async (promptData) => {
  const { scope, motive, boundaries, style, pages } = promptData;

  const rawPrompt = [
    scope && `Type/Scope: ${scope}`,
    motive && `Main Goal: ${motive}`,
    boundaries && `Constraints: ${boundaries}`,
    style && `Design Style: ${style}`,
    pages && `Pages: ${pages}`,
  ].filter(Boolean).join('\n');

  const hf = getHFClient();
  if (hf) {
    try {
      const result = await hf.textGeneration({
        model: process.env.HUGGINGFACE_MODEL || 'gpt2',
        inputs: `Expand these website requirements into a detailed AI prompt for generating a beautiful website:\n\n${rawPrompt}\n\nDetailed prompt:`,
        parameters: { max_new_tokens: 300, temperature: 0.7, top_p: 0.9 },
      });
      const enhanced = result.generated_text.split('Detailed prompt:').pop().trim();
      if (enhanced.length > 50) return buildFullPrompt(rawPrompt, enhanced);
    } catch (err) {
      console.warn('[HuggingFace] Enhancement failed, using fallback:', err.message);
    }
  }

  return buildFullPrompt(rawPrompt);
};

const buildFullPrompt = (rawPrompt, hfOutput = '') => {
  return `
Create a complete, production-ready website (self-contained HTML file with embedded CSS and JavaScript).

== USER REQUIREMENTS ==
${rawPrompt}

${hfOutput ? `== AI ENHANCEMENT ==\n${hfOutput}\n` : ''}

== TECHNICAL SPECIFICATIONS ==
- Output a single complete HTML file with ALL CSS embedded in <style> tags and ALL JavaScript embedded in <script> tags
- Fully responsive and mobile-first (works on all screen sizes from 320px to 4K)
- Beautiful, modern, professional design with dark theme preferred
- Uses CSS Grid and Flexbox for layout
- Smooth animations and transitions
- Proper semantic HTML5 structure with meta tags for SEO
- Accessible with ARIA labels where appropriate

== DESIGN REQUIREMENTS ==
- Professional curated color palette (use CSS variables)
- Premium typography using Google Fonts (load via <link> tag)
- Include: hero section, features/services, about/story, contact, footer
- All interactive elements have smooth hover/click/focus effects
- Micro-animations on scroll using Intersection Observer
- Mobile navigation with hamburger menu

== OUTPUT FORMAT ==
Output ONLY the complete HTML file starting with <!DOCTYPE html> and ending with </html>.
Do not include any explanation or markdown code blocks.
`.trim();
};
