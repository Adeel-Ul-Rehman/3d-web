import path from 'path';
import fs from 'fs-extra';
import { CONSTANTS } from '../utils/constants.js';

export const downloadProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const zipPath = path.join(CONSTANTS.GENERATED_PATH, projectId, `${projectId}.zip`);

    if (!await fs.pathExists(zipPath)) {
      return res.status(404).json({
        success: false,
        error: { message: 'ZIP file not found. Please regenerate this project.' },
      });
    }

    const stat = await fs.stat(zipPath);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${projectId}.zip"`);
    res.setHeader('Content-Length', stat.size);

    const fileStream = fs.createReadStream(zipPath);
    fileStream.on('error', next);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
