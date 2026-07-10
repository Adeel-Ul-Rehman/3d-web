import fs from 'fs-extra';
import path from 'path';
import { CONSTANTS } from '../utils/constants.js';

export const createProjectDirectory = async (projectId) => {
  const projectPath = path.join(CONSTANTS.GENERATED_PATH, projectId);
  await fs.ensureDir(projectPath);
  await fs.ensureDir(path.join(projectPath, 'assets'));
  return projectPath;
};

export const saveGeneratedFiles = async (projectId, files) => {
  const projectPath = path.join(CONSTANTS.GENERATED_PATH, projectId);
  await fs.ensureDir(projectPath);
  await fs.ensureDir(path.join(projectPath, 'assets'));

  const { html, css, js, assets = [] } = files;

  // Build a fully self-contained HTML file (embed CSS + JS inline)
  let fullHtml = html || '';

  // If there is a separate CSS file, embed it into <head>
  if (css && fullHtml.includes('</head>') && !fullHtml.includes('<style>')) {
    fullHtml = fullHtml.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
  }

  // If there is a separate JS file, embed it before </body>
  if (js && fullHtml.includes('</body>') && !fullHtml.includes('<script>')) {
    fullHtml = fullHtml.replace('</body>', `<script>\n${js}\n</script>\n</body>`);
  }

  await fs.writeFile(path.join(projectPath, 'index.html'), fullHtml, 'utf8');
  if (css) await fs.writeFile(path.join(projectPath, 'styles.css'), css, 'utf8');
  if (js) await fs.writeFile(path.join(projectPath, 'scripts.js'), js, 'utf8');

  for (const asset of assets) {
    if (asset.buffer) {
      await fs.writeFile(path.join(projectPath, 'assets', asset.filename), asset.buffer);
    }
  }

  return projectPath;
};

export const getProjectFiles = async (projectId) => {
  const projectPath = path.join(CONSTANTS.GENERATED_PATH, projectId);
  const files = {};
  try { files.html = await fs.readFile(path.join(projectPath, 'index.html'), 'utf8'); } catch (_) {}
  try { files.css = await fs.readFile(path.join(projectPath, 'styles.css'), 'utf8'); } catch (_) {}
  try { files.js = await fs.readFile(path.join(projectPath, 'scripts.js'), 'utf8'); } catch (_) {}
  return files;
};

export const deleteProjectDirectory = async (projectId) => {
  const projectPath = path.join(CONSTANTS.GENERATED_PATH, projectId);
  await fs.remove(projectPath);
};
