import path from 'path';
import fs from 'fs-extra';
import { CONSTANTS } from '../utils/constants.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export const getPreview = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const projectPath = path.join(CONSTANTS.GENERATED_PATH, projectId);
    const indexPath = path.join(projectPath, 'index.html');

    if (!await fs.pathExists(indexPath)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' },
      });
    }

    let html = await fs.readFile(indexPath, 'utf8');

    // Inject separate CSS if not already inlined
    const cssPath = path.join(projectPath, 'styles.css');
    if (await fs.pathExists(cssPath) && !html.includes('<style>')) {
      const css = await fs.readFile(cssPath, 'utf8');
      html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    }

    // Inject separate JS if not already inlined
    const jsPath = path.join(projectPath, 'scripts.js');
    if (await fs.pathExists(jsPath) && !html.includes('<script>')) {
      const js = await fs.readFile(jsPath, 'utf8');
      html = html.replace('</body>', `<script>\n${js}\n</script>\n</body>`);
    }

    // ✅ FIX: Rewrite relative asset paths to absolute backend URLs
    // Generated HTML uses: src="assets/logo.png"
    // This rewrites to: http://localhost:5000/api/preview/{projectId}/assets/logo.png
    // so images and 3D models load correctly inside iframes and new tabs
    const assetBaseUrl = `${BASE_URL}/api/preview/${projectId}/assets`;
    html = html.replace(
      /\b(src|href)="assets\/([^"]+)"/gi,
      (match, attr, filename) => `${attr}="${assetBaseUrl}/${filename}"`
    );
    // Also handle model-viewer src attribute
    html = html.replace(
      /\bsrc="assets\/([^"]+\.(?:glb|gltf))"/gi,
      (match, filename) => `src="${assetBaseUrl}/${filename}"`
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Allow embedding in iframes from any origin (needed for preview modal)
    res.removeHeader('X-Frame-Options');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.send(html);
  } catch (error) {
    next(error);
  }
};
