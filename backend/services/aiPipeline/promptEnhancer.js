import { HfInference } from '@huggingface/inference';

let hfClient = null;

const getHFClient = () => {
  if (!hfClient && process.env.HUGGINGFACE_API_KEY) {
    hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }
  return hfClient;
};

/**
 * Enhance the raw user prompt into a structured generation prompt.
 * @param {Object} promptData - The structured prompt object from the frontend
 * @param {string} templateName - The resolved template name string (e.g. "3D Luxury Showroom")
 */
export const enhancePrompt = async (promptData, templateName = '') => {
  const { scope, motive, boundaries, style, pages } = promptData;

  const rawPrompt = [
    scope     && `Type/Scope: ${scope}`,
    motive    && `Main Goal: ${motive}`,
    boundaries && `Constraints: ${boundaries}`,
    style     && `Design Style: ${style}`,
    pages     && `Pages: ${pages}`,
    // ✅ FIX: Always include the selected template name so codeGenerator can branch on it
    templateName && templateName !== 'default' && `Selected Template: ${templateName}`,
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
      if (enhanced.length > 50) return buildFullPrompt(rawPrompt, enhanced, templateName);
    } catch (err) {
      console.warn('[HuggingFace] Enhancement failed, using fallback:', err.message);
    }
  }

  return buildFullPrompt(rawPrompt, '', templateName);
};

/**
 * Build the final structured prompt string that codeGenerator will parse.
 */
const buildFullPrompt = (rawPrompt, hfOutput = '', templateName = '') => {
  return `
Create a complete, production-ready website (self-contained HTML file with embedded CSS and JavaScript).

== USER REQUIREMENTS ==
${rawPrompt}

${hfOutput ? `== AI ENHANCEMENT ==\n${hfOutput}\n` : ''}

== SELECTED TEMPLATE ==
${templateName || 'Default'}

== TECHNICAL SPECIFICATIONS ==
- Output a single complete HTML file with ALL CSS embedded in <style> tags and ALL JavaScript embedded in <script> tags
- Fully responsive and mobile-first (works on all screen sizes from 320px to 4K)
- Beautiful, modern, professional design — adapt the color theme based on "Design Style" above
- Uses CSS Grid and Flexbox for layout
- Smooth animations and transitions
- Proper semantic HTML5 structure with meta tags for SEO
- Accessible with ARIA labels where appropriate

== DESIGN REQUIREMENTS ==
- Professional curated color palette using CSS custom properties (--accent, --bg, --text, etc.)
- Premium typography using Google Fonts (load via <link> tag)
- Include: hero section, features/services, about/story, product showcase, contact (if requested), footer
- All interactive elements have smooth hover/click/focus effects
- Micro-animations on scroll using Intersection Observer
- Mobile navigation with hamburger menu
- Interactive 3D canvas element using Three.js (CDN), geometry chosen based on the Selected Template
- If user uploaded a .glb/.gltf 3D model, use <model-viewer> instead of Three.js canvas
- If user uploaded images, display them in the product/gallery sections

== OUTPUT FORMAT ==
Output ONLY the complete HTML file starting with <!DOCTYPE html> and ending with </html>.
Do not include any explanation or markdown code blocks.
`.trim();
};
