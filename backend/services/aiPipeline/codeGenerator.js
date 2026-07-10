import fetch from 'node-fetch';
import { CONSTANTS } from '../../utils/constants.js';
import { parseGeneratedCode } from '../../utils/helpers.js';

export const generateCode = async (enhancedPrompt, answers = {}) => {
  // Build context from Q&A answers
  const qaContext = Object.entries(answers)
    .map(([k, v]) => `- Q${k}: ${v}`)
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

  // Fallback: built-in high-quality generator
  console.log('[CodeGen] Using built-in fallback generator');
  return generateFallbackWebsite(enhancedPrompt, answers);
};

const generateFallbackWebsite = (prompt, answers) => {
  // Extract meaningful data from the prompt
  const scopeMatch = prompt.match(/Type\/Scope:\s*([^\n]+)/i);
  const motiveMatch = prompt.match(/Main Goal:\s*([^\n]+)/i);
  const styleMatch = prompt.match(/Design Style:\s*([^\n]+)/i);

  const scope = scopeMatch?.[1]?.trim() || 'Business';
  const motive = motiveMatch?.[1]?.trim() || 'showcase our services';
  const style = styleMatch?.[1]?.trim() || 'modern dark';

  // Pick accent color based on style keywords
  let accent = '#3b82f6';
  let accentDark = '#1d4ed8';
  let accentGlow = 'rgba(59,130,246,0.3)';
  if (/gold|luxury|premium/i.test(style)) { accent = '#f59e0b'; accentDark = '#d97706'; accentGlow = 'rgba(245,158,11,0.3)'; }
  if (/green|eco|nature/i.test(style)) { accent = '#10b981'; accentDark = '#059669'; accentGlow = 'rgba(16,185,129,0.3)'; }
  if (/purple|creative/i.test(style)) { accent = '#8b5cf6'; accentDark = '#7c3aed'; accentGlow = 'rgba(139,92,246,0.3)'; }
  if (/red|bold|energy/i.test(style)) { accent = '#ef4444'; accentDark = '#dc2626'; accentGlow = 'rgba(239,68,68,0.3)'; }

  // Pick a Google Font based on style
  let fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
  let fontFamily = "'Inter', system-ui, sans-serif";
  if (/luxury|elegant|fashion/i.test(style)) {
    fontUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500&display=swap';
    fontFamily = "'Playfair Display', 'Inter', serif";
  }

  const siteName = scope.split(' ').slice(0, 3).join(' ');
  const q1Answer = answers?.[1] || '3D products and services';
  const q3Answer = answers?.[3] ? 'true' : null;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${siteName} - ${motive}" />
  <title>${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="${fontUrl}" />
  <style>
    :root {
      --accent: ${accent};
      --accent-dark: ${accentDark};
      --accent-glow: ${accentGlow};
      --bg: #020617;
      --bg2: #0f172a;
      --bg3: #1e293b;
      --border: rgba(255,255,255,0.08);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
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
    .nav-logo { font-size: 1.25rem; font-weight: 800; color: var(--accent); text-decoration: none; letter-spacing: -0.02em; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: var(--text); }
    .nav-cta { padding: 0.5rem 1.25rem; background: var(--accent); color: white; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 0 20px var(--accent-glow); }
    .nav-cta:hover { background: var(--accent-dark); transform: scale(1.04); }
    .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
    .hamburger span { width: 24px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.3s; }
    @media (max-width: 768px) {
      .nav-links { display: none; position: fixed; top: 68px; left: 0; right: 0; bottom: 0; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; background: var(--bg); font-size: 1.5rem; }
      .nav-links.open { display: flex; }
      .hamburger { display: flex; }
    }

    /* ─── HERO ─── */
    #hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      text-align: center; padding: 8rem 5% 6rem;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%), var(--bg);
      position: relative; overflow: hidden;
    }
    #hero::before {
      content: ''; position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.4;
    }
    .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 9999px; border: 1px solid var(--accent); background: rgba(59,130,246,0.1); color: var(--accent); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.5rem; }
    .hero-title { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1.5rem; }
    .hero-title span { background: linear-gradient(135deg, var(--accent), #a78bfa); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-sub { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--text-muted); max-width: 600px; margin: 0 auto 2.5rem; }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn-primary { padding: 0.85rem 2rem; background: var(--accent); color: white; border-radius: 9999px; font-weight: 700; text-decoration: none; font-size: 1rem; transition: all 0.2s; box-shadow: 0 0 30px var(--accent-glow); }
    .btn-primary:hover { background: var(--accent-dark); transform: translateY(-2px); box-shadow: 0 4px 30px var(--accent-glow); }
    .btn-outline { padding: 0.85rem 2rem; border: 1px solid var(--border); color: var(--text); border-radius: 9999px; font-weight: 600; text-decoration: none; font-size: 1rem; transition: all 0.2s; background: transparent; }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

    /* ─── SECTIONS ─── */
    section { padding: 6rem 5%; }
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
      padding: 2rem; transition: all 0.3s; opacity: 0; transform: translateY(30px);
    }
    .feature-card.visible { opacity: 1; transform: translateY(0); }
    .feature-card:hover { border-color: var(--accent); transform: translateY(-6px); box-shadow: 0 12px 40px var(--accent-glow); }
    .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .feature-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .feature-card p { color: var(--text-muted); font-size: 0.925rem; line-height: 1.7; }

    /* ─── ABOUT ─── */
    #about { background: var(--bg); }
    .about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; max-width: 1100px; margin: 0 auto; }
    .about-visual { background: linear-gradient(135deg, var(--bg2), var(--bg3)); border-radius: 1.5rem; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); font-size: 5rem; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; }
    .stat { background: var(--bg3); border-radius: 0.75rem; padding: 1.25rem; border: 1px solid var(--border); }
    .stat-value { font-size: 2rem; font-weight: 900; color: var(--accent); letter-spacing: -0.03em; }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    @media (max-width: 768px) { .about-inner { grid-template-columns: 1fr; gap: 2.5rem; } }

    /* ─── PRODUCTS / Q1 ─── */
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

    /* ─── CONTACT (conditional) ─── */
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
    .form-submit { padding: 0.85rem; background: var(--accent); color: white; border: none; border-radius: 9999px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; font-family: var(--font); }
    .form-submit:hover { background: var(--accent-dark); }
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
    <a href="#hero" class="nav-logo">${siteName}</a>
    <ul class="nav-links" id="navLinks">
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#products">Services</a></li>
      ${q3Answer ? '<li><a href="#contact">Contact</a></li>' : ''}
    </ul>
    <a href="#contact" class="nav-cta">Get Started</a>
    <div class="hamburger" id="hamburger" aria-label="Toggle menu" role="button" tabindex="0">
      <span></span><span></span><span></span>
    </div>
  </nav>

  <!-- HERO -->
  <section id="hero">
    <div>
      <div class="hero-badge">⚡ ${scope}</div>
      <h1 class="hero-title">
        Built to<br/><span>${motive.split(' ').slice(0, 4).join(' ')}</span>
      </h1>
      <p class="hero-sub">Experience the next generation of ${scope.toLowerCase()}. Designed to ${motive.toLowerCase()}.</p>
      <div class="hero-actions">
        <a href="#products" class="btn-primary">Explore Now →</a>
        <a href="#about" class="btn-outline">Learn More</a>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features">
    <div class="features-header">
      <div class="section-label">Why Choose Us</div>
      <h2 class="section-title">Everything You Need</h2>
      <p class="section-sub">We combine cutting-edge technology with beautiful design to deliver exceptional results.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🚀</div>
        <h3>Lightning Fast</h3>
        <p>Optimized for peak performance, ensuring blazing-fast load times across all devices and networks.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>Mobile First</h3>
        <p>Every pixel is crafted for mobile devices first, then enhanced for larger screens seamlessly.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>Premium Design</h3>
        <p>Sleek, professional aesthetics that command attention and build immediate trust with visitors.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Secure & Reliable</h3>
        <p>Built with security best practices and 99.9% uptime guarantee to keep your business running.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Analytics Ready</h3>
        <p>Integrated analytics hooks let you track every interaction and continuously improve performance.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⚙️</div>
        <h3>Fully Customizable</h3>
        <p>Every element is modular and configurable to match your brand identity perfectly.</p>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about">
    <div class="about-inner">
      <div>
        <div class="section-label">Our Story</div>
        <h2 class="section-title">Who We Are</h2>
        <p style="color:var(--text-muted); margin-bottom:1rem; line-height:1.8;">
          We are a passionate team dedicated to delivering world-class ${scope.toLowerCase()} solutions. Our mission is to ${motive.toLowerCase()} while maintaining the highest standards of quality and innovation.
        </p>
        <div class="stats-grid">
          <div class="stat"><div class="stat-value">500+</div><div class="stat-label">Clients</div></div>
          <div class="stat"><div class="stat-value">98%</div><div class="stat-label">Satisfaction</div></div>
          <div class="stat"><div class="stat-value">10+</div><div class="stat-label">Years Exp.</div></div>
          <div class="stat"><div class="stat-value">24/7</div><div class="stat-label">Support</div></div>
        </div>
      </div>
      <div class="about-visual">🏆</div>
    </div>
  </section>

  <!-- PRODUCTS / SERVICES -->
  <section id="products">
    <div class="section-label" style="text-align:center">What We Offer</div>
    <h2 class="section-title" style="text-align:center;margin-bottom:0.5rem">Our Services</h2>
    <p class="section-sub" style="text-align:center;margin:0 auto 0.5rem">Featuring: ${q1Answer}</p>
    <div class="products-grid">
      ${['Premium Plan', 'Standard Plan', 'Enterprise Plan', 'Custom Solution'].map((name, i) => `
      <div class="product-card">
        <div class="product-icon">${['✦', '◈', '⬡', '★'][i]}</div>
        <h3>${name}</h3>
        <p>Tailored ${scope.toLowerCase()} solutions designed to maximize your results and exceed expectations.</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- CONTACT (if Q3 answered yes) -->
  ${q3Answer ? `
  <section id="contact">
    <div class="contact-inner">
      <div class="section-label">Get In Touch</div>
      <h2 class="section-title">Contact Us</h2>
      <p class="section-sub">Have a question or ready to get started? Send us a message.</p>
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
          <textarea id="message" name="message" placeholder="Tell us about your project..." required></textarea>
        </div>
        <button type="submit" class="form-submit">Send Message →</button>
      </form>
    </div>
  </section>` : ''}

  <!-- FOOTER -->
  <footer>
    <p>© ${new Date().getFullYear()} <a href="#hero">${siteName}</a>. All rights reserved. Built with ❤️ by MobileFirst3D.</p>
  </footer>

  <script>
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    hamburger.addEventListener('keypress', (e) => { if (e.key === 'Enter') navLinks.classList.toggle('open'); });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.feature-card, .product-card').forEach(el => observer.observe(el));

    // Stagger animations
    document.querySelectorAll('.feature-card, .product-card').forEach((el, i) => {
      el.style.transitionDelay = \`\${i * 0.08}s\`;
    });

    // Contact form handler
    function handleSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('.form-submit');
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#10b981';
      e.target.reset();
      setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; }, 3000);
    }

    // Smooth scroll for CTA
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
