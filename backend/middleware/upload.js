import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { CONSTANTS } from '../utils/constants.js';

await fs.ensureDir(CONSTANTS.UPLOADS_PATH);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.glb', '.gltf', '.mp4'];
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not supported: ${file.originalname}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: CONSTANTS.MAX_FILE_SIZE },
});

export const uploadMultiple = upload.array('files', 10);
