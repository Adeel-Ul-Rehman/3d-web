import path from 'path';
import fs from 'fs-extra';
import { CONSTANTS } from '../utils/constants.js';

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

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.send(html);
  } catch (error) {
    next(error);
  }
};
