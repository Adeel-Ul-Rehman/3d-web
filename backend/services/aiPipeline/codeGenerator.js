import fetch from 'node-fetch';
import { CONSTANTS } from '../../utils/constants.js';
import { parseGeneratedCode } from '../../utils/helpers.js';

export const generateCode = async (enhancedPrompt, answers = {}, template = '', files = []) => {
  // Build context from Q&A answers
  const qaContext = Object.entries(answers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  const fullPrompt = qaContext
    ? `${enhancedPrompt}\n\n== Q&A REFINEMENTS ==\n${qaContext}`
    : enhancedPrompt;

  // Attempt 1: KrizVibe free API
  try {
    const res = await fetch(CONSTANTS.KRIZVIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt, format: 'html' }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const data = await res.json();
      const parsed = parseGeneratedCode(data.result || data.content || '');
      if (parsed.html && parsed.html.includes('<!DOCTYPE')) {
        console.log('[CodeGen] KrizVibe success');
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[CodeGen] KrizVibe failed:', err.message);
  }

  // Fallback: built-in high-quality template-specific generator
  console.log('[CodeGen] Using built-in fallback generator');
  return generateFallbackWebsite(enhancedPrompt, answers, template, files);
};

const generateFallbackWebsite = (prompt, answers, template, files) => {
  // 1. Parse template name — check `template` arg first, then fall back to prompt section
  let templateName = 'default';
  if (template && typeof template === 'string') {
    try {
      const parsedT = JSON.parse(template);
      templateName = parsedT.name || template;
    } catch (_) {
      templateName = template; // plain string like "3D Luxury Showroom"
    }
  } else if (template && typeof template === 'object') {
    templateName = template.name || 'default';
  }

  // Also parse from the structured prompt if template arg is still default/empty
  if (!templateName || templateName === 'default' || templateName === '{}') {
    const tplMatch = prompt.match(/== SELECTED TEMPLATE ==\s*\n([^\n=]+)/i);
    if (tplMatch) templateName = tplMatch[1].trim();
  }

  // 2. Extract scope/motive/style/boundaries from prompt
  const scopeMatch = prompt.match(/Type\/Scope:\s*([^\n]+)/i);
  const motiveMatch = prompt.match(/Main Goal:\s*([^\n]+)/i);
  const styleMatch = prompt.match(/Design Style:\s*([^\n]+)/i);
  const boundariesMatch = prompt.match(/Constraints:\s*([^\n]+)/i);


  const scope = scopeMatch?.[1]?.trim() || 'Business';
  const motive = motiveMatch?.[1]?.trim() || 'showcase our services';
  const style = styleMatch?.[1]?.trim() || 'modern dark';
  const boundaries = boundariesMatch?.[1]?.trim() || '';

  const siteName = scope.split(' ').slice(0, 3).join(' ');

  // 3. Scan user files/assets
  const glbFile = files.find(f => {
    const name = (f.filename || f.originalname || '').toLowerCase();
    return name.endsWith('.glb') || name.endsWith('.gltf');
  });
  const logoFile = files.find(f => {
    const name = (f.filename || f.originalname || '').toLowerCase();
    return /logo/i.test(name) && name.match(/\.(jpg|jpeg|png|webp|svg)$/i);
  });
  const imageFiles = files.filter(f => {
    const name = (f.filename || f.originalname || '').toLowerCase();
    return !/logo/i.test(name) && name.match(/\.(jpg|jpeg|png|webp|svg)$/i);
  });

  // 4. Style Customization based on prompt style keywords
  let isLight = /light|white|clean light/i.test(style) || /light|white/i.test(boundaries);
  let bg = isLight ? '#f8fafc' : '#020617';
  let bg2 = isLight ? '#f1f5f9' : '#0f172a';
  let bg3 = isLight ? '#ffffff' : '#1e293b';
  let text = isLight ? '#0f172a' : '#f1f5f9';
  let textMuted = isLight ? '#475569' : '#94a3b8';
  let border = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';

  // Accent Colors scan
  let accent = '#3b82f6';
  let accentDark = '#1d4ed8';
  let accentGlow = 'rgba(59,130,246,0.3)';

  if (/gold|yellow|luxury|premium|amber/i.test(style) || /gold|yellow/i.test(boundaries)) {
    accent = '#f59e0b'; accentDark = '#d97706'; accentGlow = 'rgba(245,158,11,0.3)';
  } else if (/green|emerald|eco|nature/i.test(style) || /green|emerald/i.test(boundaries)) {
    accent = '#10b981'; accentDark = '#059669'; accentGlow = 'rgba(16,185,129,0.3)';
  } else if (/purple|violet|creative|fuchsia/i.test(style) || /purple|violet/i.test(boundaries)) {
    accent = '#8b5cf6'; accentDark = '#7c3aed'; accentGlow = 'rgba(139,92,246,0.3)';
  } else if (/red|crimson|bold|rose/i.test(style) || /red|crimson|rose/i.test(boundaries)) {
    accent = '#f43f5e'; accentDark = '#e11d48'; accentGlow = 'rgba(244,63,94,0.3)';
  } else if (/orange|coral|sunset/i.test(style) || /orange|coral/i.test(boundaries)) {
    accent = '#f97316'; accentDark = '#ea580c'; accentGlow = 'rgba(249,115,22,0.3)';
  } else if (/cyan|teal|neon blue/i.test(style) || /cyan|teal/i.test(boundaries)) {
    accent = '#06b6d4'; accentDark = '#0891b2'; accentGlow = 'rgba(6,182,212,0.3)';
  }

  // Fonts scan
  let fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
  let fontFamily = "'Inter', system-ui, sans-serif";
  if (/luxury|elegant|fashion|serif|playfair/i.test(style)) {
    fontUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500&display=swap';
    fontFamily = "'Playfair Display', serif";
  } else if (/mono|tech|code|space/i.test(style)) {
    fontUrl = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;600&display=swap';
    fontFamily = "'Fira Code', monospace";
  }

  // 5. Layout and Geometry Selection based on Template Name
  let threeJSGeometrySetup = '';
  let templateHeader = 'IMMERSIBLE 3D PLATFORM';
  let featureCards = [];
  let itemsShowcase = [];
  let isModelViewerEnabled = !!glbFile;

  const tLower = templateName.toLowerCase();

  if (tLower.includes('showroom') || tLower.includes('commerce') || tLower.includes('shop')) {
    // Torus Knot for Luxury Showroom
    threeJSGeometrySetup = `
      const geometry = new THREE.TorusKnotGeometry(1.4, 0.45, 120, 16);
      const material = new THREE.MeshStandardMaterial({
        color: "${accent}", roughness: 0.1, metalness: 0.9, flatShading: false
      });
    `;
    templateHeader = '3D SHOWROOM';
    featureCards = [
      { icon: '🛋️', title: 'Interactive Catalog', desc: 'Inspect product dimensions, colors, and textures from any orbital angle.' },
      { icon: '🏷️', title: 'Direct Pre-Order', desc: 'Secure custom tailored furniture items with embedded stripe-ready widgets.' },
      { icon: '✨', title: 'Premium Crafting', desc: 'Curated organic materials designed to match elite interior environments.' }
    ];
    itemsShowcase = ['Elite Sofa Chair', 'Glass Coffee Table', 'Modern Office Lounge', 'Luxury Hanging Pendant'];
  } 
  else if (tLower.includes('architectural') || tLower.includes('real estate') || tLower.includes('house') || tLower.includes('gallery')) {
    // Wireframe Box for Architecture Gallery
    threeJSGeometrySetup = `
      const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
      const material = new THREE.MeshBasicMaterial({
        color: "${accent}", wireframe: true, transparent: true, opacity: 0.7
      });
    `;
    templateHeader = 'ARCHITECTURAL FRAME';
    featureCards = [
      { icon: '🏠', title: '3D Floorplans', desc: 'Inspect volumetric spaces and room arrangements inside our viewport mesh.' },
      { icon: '📍', title: 'Interactive Markers', desc: 'Clickable info hotspots mapping blueprint elevations onto live screens.' },
      { icon: '🌱', title: 'Sustainable Core', desc: 'Energy metrics and material durability calculations built into design layouts.' }
    ];
    itemsShowcase = ['Contemporary Villa', 'Penthouse Layout', 'Eco duplex model', 'Corporate Workspace'];
  } 
  else if (tLower.includes('portfolio') || tLower.includes('creative') || tLower.includes('art')) {
    // Icosahedron for Portfolio
    threeJSGeometrySetup = `
      const geometry = new THREE.IcosahedronGeometry(1.6, 1);
      const material = new THREE.MeshStandardMaterial({
        color: "${accent}", roughness: 0.2, metalness: 0.8, flatShading: true
      });
    `;
    templateHeader = 'CREATIVE GALLERY';
    featureCards = [
      { icon: '⚡', title: 'Interactive Works', desc: 'Float and scale modular design units directly on mouse movement.' },
      { icon: '🛠️', title: 'WebGL Integration', desc: 'High performance physics-backed layouts that load instantly on all browsers.' },
      { icon: '📐', title: 'Technical Accuracy', desc: 'Responsive grid architecture built with extreme layout precision.' }
    ];
    itemsShowcase = ['Brand Identity Pack', 'WebGL Landing Mesh', 'Volumetric Render Spec', 'Interactive App UI'];
  }
  else if (tLower.includes('saas') || tLower.includes('dashboard') || tLower.includes('corporate')) {
    // Octahedron for SaaS
    threeJSGeometrySetup = `
      const geometry = new THREE.OctahedronGeometry(1.5, 0);
      const material = new THREE.MeshStandardMaterial({
        color: "${accent}", wireframe: true, roughness: 0.3, metalness: 0.7
      });
    `;
    templateHeader = 'SaaS PLATFORM MESH';
    featureCards = [
      { icon: '📈', title: 'Metric Dashboards', desc: 'Monitor active conversion analytics and traffic maps instantly.' },
      { icon: '⚡', title: 'Blazing Performance', desc: 'Average load times under 0.8 seconds to optimize lead capture conversion.' },
      { icon: '🔌', title: 'Integrations', desc: 'Connect database triggers, CRM triggers, and marketing tags cleanly.' }
    ];
    itemsShowcase = ['Conversion Trackers', 'Traffic Geo Heatmap', 'Volumetric Lead Engine', 'Cloud Metrics Board'];
  }
  else {
    // Default Torus
    threeJSGeometrySetup = `
      const geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 100);
      const material = new THREE.MeshStandardMaterial({
        color: "${accent}", roughness: 0.4, metalness: 0.7
      });
    `;
    templateHeader = 'INTERACTIVE PREVIEW';
    featureCards = [
      { icon: '🚀', title: 'Fast Rendering', desc: 'WebGL rendering optimized for low latency and high frames.' },
      { icon: '📱', title: 'Fluid Spacing', desc: 'Fully responsive CSS layout built with grid-based system variables.' },
      { icon: '⚙️', title: 'Flexible Core', desc: 'Modify design elements easily with direct parameter edits.' }
    ];
    itemsShowcase = ['Core Solution A', 'Advanced Module B', 'Modular Package C', 'Custom Option D'];
  }

  // 6. Map answers List
  const answersList = Object.entries(answers);
  const q1Entry = answersList.find(([q]) => /product|service|model/i.test(q)) || answersList[0];
  const q1Answer = q1Entry ? q1Entry[1] : '3D products and services';
  const q3Entry = answersList.find(([q]) => /contact|email|form|chat/i.test(q)) || answersList[2];
  const q3Answer = q3Entry ? (!/no|none|not applicable/i.test(q3Entry[1])) : false;

  // 7. Inject Logo HTML
  let logoHtml = `<span class="nav-logo-text">${siteName}</span>`;
  if (logoFile) {
    logoHtml = `<img src="assets/${logoFile.filename || logoFile.originalname}" alt="${siteName}" style="height: 38px; max-width: 170px; object-fit: contain;">`;
  }

  // 8. Inject 3D Viewport HTML
  let canvasOrViewerHtml = '';
  if (isModelViewerEnabled) {
    canvasOrViewerHtml = `
      <model-viewer 
        src="assets/${glbFile.filename || glbFile.originalname}" 
        ar 
        ar-modes="webxr scene-viewer quick-look" 
        camera-controls 
        autoplay 
        shadow-intensity="1" 
        style="width: 100%; height: 100%; outline: none;"
      ></model-viewer>
    `;
  } else {
    canvasOrViewerHtml = `<canvas id="threeCanvas"></canvas>`;
  }

  // 9. Generate Product Cards showcasing uploaded images if present
  let productsCardsHtml = '';
  itemsShowcase.forEach((name, i) => {
    // If we have uploaded images, use them for product previews
    const userImg = imageFiles[i];
    const imageHtml = userImg
      ? `<img src="assets/${userImg.filename || userImg.originalname}" alt="${name}" class="card-image-display" style="width:100%; height:180px; object-fit:cover; border-radius:var(--radius); margin-bottom:1rem; border: 1px solid var(--border);">`
      : `<div class="product-icon">${featureCards[i % featureCards.length].icon}</div>`;

    productsCardsHtml += `
      <div class="product-card">
        ${imageHtml}
        <h3>${name}</h3>
        <p>Expertly aligned to achieve your core target goal: "${motive}".</p>
      </div>
    `;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${siteName} - ${motive}" />
  <title>${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="${fontUrl}" />
  ${isModelViewerEnabled ? '<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>' : ''}
  <style>
    :root {
      --accent: ${accent};
      --accent-dark: ${accentDark};
      --accent-glow: ${accentGlow};
      --bg: ${bg};
      --bg2: ${bg2};
      --bg3: ${bg3};
      --border: ${border};
      --text: ${text};
      --text-muted: ${textMuted};
      --font: ${fontFamily};
      --radius: 1rem;
      --shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body { font-family: var(--font); background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }

    /* ─── NAVBAR ─── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 5%; height: 68px;
      background: rgba(2,6,23,0.85); backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .nav-logo { font-size: 1.25rem; font-weight: 800; color: var(--accent); text-decoration: none; letter-spacing: -0.02em; display: flex; align-items: center; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: var(--text); }
    .nav-cta { padding: 0.5rem 1.25rem; background: var(--accent); color: ${isLight ? 'white' : 'black'}; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 0 20px var(--accent-glow); }
    .nav-cta:hover { background: var(--accent-dark); transform: scale(1.04); color: white; }
    .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
    .hamburger span { width: 24px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.3s; }
    @media (max-width: 768px) {
      .nav-links { display: none; position: fixed; top: 68px; left: 0; right: 0; bottom: 0; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; background: var(--bg); font-size: 1.5rem; }
      .nav-links.open { display: flex; }
      .hamburger { display: flex; }
    }

    /* ─── HERO ─── */
    #hero {
      min-height: 100vh; display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: center;
      padding: 8rem 5% 6rem; gap: 4rem;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-glow) 0%, transparent 70%), var(--bg);
      position: relative; overflow: hidden;
    }
    @media (max-width: 991px) {
      #hero { grid-template-columns: 1fr; text-align: center; padding-top: 7rem; }
    }
    .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 9999px; border: 1px solid var(--accent); background: rgba(59,130,246,0.05); color: var(--accent); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.5rem; }
    .hero-title { font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.5rem; }
    .hero-title span { background: linear-gradient(135deg, var(--accent), #a78bfa); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-sub { font-size: clamp(1rem, 1.8vw, 1.2rem); color: var(--text-muted); max-width: 600px; margin-bottom: 2.5rem; }
    @media (max-width: 991px) { .hero-sub { margin: 0 auto 2.5rem; } }
    .hero-actions { display: flex; gap: 1rem; justify-content: flex-start; flex-wrap: wrap; }
    @media (max-width: 991px) { .hero-actions { justify-content: center; } }
    .btn-primary { padding: 0.85rem 2rem; background: var(--accent); color: ${isLight ? 'white' : 'black'}; border-radius: 9999px; font-weight: 700; text-decoration: none; font-size: 1rem; transition: all 0.2s; box-shadow: 0 0 30px var(--accent-glow); }
    .btn-primary:hover { background: var(--accent-dark); transform: translateY(-2px); box-shadow: 0 4px 30px var(--accent-glow); color: white; }
    .btn-outline { padding: 0.85rem 2rem; border: 1px solid var(--border); color: var(--text); border-radius: 9999px; font-weight: 600; text-decoration: none; font-size: 1rem; transition: all 0.2s; background: transparent; }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

    .canvas-viewport {
      height: 480px; position: relative; border-radius: 2rem; overflow: hidden;
      background: radial-gradient(circle, var(--bg2) 0%, transparent 80%);
      border: 1px solid var(--border); box-shadow: var(--shadow);
    }
    @media (max-width: 991px) { .canvas-viewport { height: 380px; max-width: 500px; width: 100%; margin: 0 auto; } }

    /* ─── SECTIONS ─── */
    section { padding: 7rem 5%; }
    .section-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent); margin-bottom: 1rem; }
    .section-title { font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .section-sub { font-size: 1.1rem; color: var(--text-muted); max-width: 560px; }

    /* ─── FEATURES ─── */
    #features { background: var(--bg2); }
    .features-header { text-align: center; margin-bottom: 4rem; }
    .features-header .section-sub { margin: 0 auto; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
    .feature-card {
      background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 2.25rem; transition: all 0.3s; opacity: 0; transform: translateY(30px);
    }
    .feature-card.visible { opacity: 1; transform: translateY(0); }
    .feature-card:hover { border-color: var(--accent); transform: translateY(-6px); box-shadow: 0 12px 40px var(--accent-glow); }
    .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .feature-card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; }
    .feature-card p { color: var(--text-muted); font-size: 0.925rem; line-height: 1.7; }

    /* ─── ABOUT ─── */
    #about { background: var(--bg); }
    .about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; max-width: 1100px; margin: 0 auto; }
    .about-visual { background: linear-gradient(135deg, var(--bg2), var(--bg3)); border-radius: 1.5rem; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); font-size: 5rem; box-shadow: var(--shadow); }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; }
    .stat { background: var(--bg3); border-radius: 0.75rem; padding: 1.25rem; border: 1px solid var(--border); }
    .stat-value { font-size: 2rem; font-weight: 900; color: var(--accent); letter-spacing: -0.03em; }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    @media (max-width: 768px) { .about-inner { grid-template-columns: 1fr; gap: 2.5rem; } }

    /* ─── PRODUCTS / SERVICES ─── */
    #products { background: var(--bg2); }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 2.5rem auto 0; }
    .product-card {
      background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 1.75rem; text-align: center; transition: all 0.3s;
      opacity: 0; transform: scale(0.95);
    }
    .product-card.visible { opacity: 1; transform: scale(1); }
    .product-card:hover { border-color: var(--accent); box-shadow: 0 8px 30px var(--accent-glow); transform: scale(1.03); }
    .product-icon { font-size: 3rem; margin-bottom: 1rem; }
    .product-card h3 { font-weight: 700; margin-bottom: 0.5rem; }
    .product-card p { color: var(--text-muted); font-size: 0.875rem; }

    /* ─── CONTACT ─── */
    #contact { background: var(--bg); }
    .contact-inner { max-width: 640px; margin: 0 auto; }
    .contact-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .form-group input, .form-group textarea {
      background: var(--bg3); border: 1px solid var(--border); border-radius: 0.75rem;
      padding: 0.75rem 1rem; color: var(--text); font-size: 0.925rem; font-family: var(--font);
      outline: none; transition: border-color 0.2s;
    }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--accent); }
    .form-group textarea { min-height: 120px; resize: vertical; }
    .form-submit { padding: 0.85rem; background: var(--accent); color: ${isLight ? 'white' : 'black'}; border: none; border-radius: 9999px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; font-family: var(--font); }
    .form-submit:hover { background: var(--accent-dark); color: white; }
    @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }

    /* ─── FOOTER ─── */
    footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 2.5rem 5%; text-align: center; }
    footer p { color: var(--text-muted); font-size: 0.875rem; }
    footer a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>

  <!-- NAVBAR -->
  <nav id="navbar">
    <a href="#hero" class="nav-logo">${logoHtml}</a>
    <ul class="nav-links" id="navLinks">
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#products">Catalog</a></li>
      ${q3Answer ? '<li><a href="#contact">Contact</a></li>' : ''}
    </ul>
    <a href="#contact" class="nav-cta">Pre-Order</a>
    <div class="hamburger" id="hamburger" aria-label="Toggle menu" role="button" tabindex="0">
      <span></span><span></span><span></span>
    </div>
  </nav>

  <!-- HERO -->
  <section id="hero">
    <div>
      <div class="hero-badge">⚡ ${templateHeader}</div>
      <h1 class="hero-title">
        Custom Tailored<br/><span>${motive.split(' ').slice(0, 4).join(' ')}</span>
      </h1>
      <p class="hero-sub">Experience the next generation of ${scope.toLowerCase()} design. Perfectly customized for styling: <b>"${style}"</b>.</p>
      <div class="hero-actions">
        <a href="#products" class="btn-primary">Explore Catalog →</a>
        <a href="#about" class="btn-outline">Learn More</a>
      </div>
    </div>
    <div class="canvas-viewport">
      ${canvasOrViewerHtml}
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features">
    <div class="features-header">
      <div class="section-label">Tailored Performance</div>
      <h2 class="section-title">Volume & Spacing Metrics</h2>
      <p class="section-sub">We combine state of the art Three.js canvases with mobile-first CSS variables.</p>
    </div>
    <div class="features-grid">
      ${featureCards.map(fc => `
        <div class="feature-card">
          <div class="feature-icon">${fc.icon}</div>
          <h3>${fc.title}</h3>
          <p>${fc.desc}</p>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about">
    <div class="about-inner">
      <div>
        <div class="section-label">Our Philosophy</div>
        <h2 class="section-title">Design with Precision</h2>
        <p style="color:var(--text-muted); margin-bottom:1.5rem; line-height:1.8;">
          We believe that interactive 3D elements should enhance usability, not get in the way of sales. That's why every project features orbital zoom locks and mobile-responsive viewport scaling.
        </p>
        <div class="stats-grid">
          <div class="stat"><div class="stat-value">500+</div><div class="stat-label">Deployments</div></div>
          <div class="stat"><div class="stat-value">0.8s</div><div class="stat-label">Load Time</div></div>
          <div class="stat"><div class="stat-value">100%</div><div class="stat-label">Volumetric</div></div>
          <div class="stat"><div class="stat-value">24/7</div><div class="stat-label">Support</div></div>
        </div>
      </div>
      <div class="about-visual">🏆</div>
    </div>
  </section>

  <!-- PRODUCTS / CATALOG -->
  <section id="products">
    <div class="section-label" style="text-align:center">Showcase</div>
    <h2 class="section-title" style="text-align:center;margin-bottom:0.5rem">Featured Items</h2>
    <p class="section-sub" style="text-align:center;margin:0 auto 2rem">Featuring answers context: "${q1Answer}"</p>
    <div class="products-grid">
      ${productsCardsHtml}
    </div>
  </section>

  <!-- CONTACT -->
  ${q3Answer ? `
  <section id="contact">
    <div class="contact-inner">
      <div class="section-label">Get In Touch</div>
      <h2 class="section-title">Contact Showroom</h2>
      <p class="section-sub">Have custom queries or request styling alterations? Book an orbital custom consultation.</p>
      <form class="contact-form" onsubmit="handleSubmit(event)">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="your@email.com" required />
          </div>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" placeholder="Describe your custom layout requests..." required></textarea>
        </div>
        <button type="submit" class="form-submit">Send Message →</button>
      </form>
    </div>
  </section>` : ''}

  <!-- FOOTER -->
  <footer>
    <p>© ${new Date().getFullYear()} <a href="#hero">${siteName}</a>. All rights reserved. Powered by MobileFirst3D.</p>
  </footer>

  ${!isModelViewerEnabled ? `
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    const container = document.querySelector('.canvas-viewport');
    const canvas = document.getElementById('threeCanvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Dynamic Geometry Injection based on template layout choice
    ${threeJSGeometrySetup}

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Setup basic standard light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    // Interactive mouse rotation drag controllers
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mousemove', (e) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
      if (isDragging) {
        mesh.rotation.y += deltaMove.x * 0.005;
        mesh.rotation.x += deltaMove.y * 0.005;
      }
      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    // Touch support for mobile layouts
    canvas.addEventListener('touchstart', (e) => {
      isDragging = true;
      const touch = e.touches[0];
      previousMousePosition = { x: touch.clientX, y: touch.clientY };
    });
    window.addEventListener('touchend', () => isDragging = false);
    canvas.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const deltaMove = {
        x: touch.clientX - previousMousePosition.x,
        y: touch.clientY - previousMousePosition.y
      };
      mesh.rotation.y += deltaMove.x * 0.01;
      mesh.rotation.x += deltaMove.y * 0.01;
      previousMousePosition = { x: touch.clientX, y: touch.clientY };
    });

    // Rotation anim loop
    function animate() {
      requestAnimationFrame(animate);
      if (!isDragging) {
        mesh.rotation.y += 0.005;
        mesh.rotation.x += 0.002;
      }
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  </script>
  ` : ''}

  <script>
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    hamburger.addEventListener('keypress', (e) => { if (e.key === 'Enter') navLinks.classList.toggle('open'); });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

    // Simple Intersection Observer to fade in features on scroll
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.feature-card, .product-card').forEach(el => obs.observe(el));

    // Stagger transition animations
    document.querySelectorAll('.feature-card, .product-card').forEach((el, i) => {
      el.style.transitionDelay = \`\${i * 0.08}s\`;
    });

    // Handle contact form submit
    function handleSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('.form-submit');
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#10b981';
      e.target.reset();
      setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 3000);
    }

    // Scroll smoothing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  </script>
</body>
</html>`;

  return { html, css: '', js: '' };
};
