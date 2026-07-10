import archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';
import { createWriteStream } from 'fs';
import { CONSTANTS } from '../utils/constants.js';

export const createProjectZip = async (projectId) => {
  const projectPath = path.join(CONSTANTS.GENERATED_PATH, projectId);
  const zipPath = path.join(projectPath, `${projectId}.zip`);

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(zipPath));
    archive.on('error', reject);

    archive.pipe(output);
    // Add HTML, CSS, JS but not the zip itself
    archive.glob('**/*', {
      cwd: projectPath,
      ignore: [`${projectId}.zip`],
    });
    archive.finalize();
  });
};
