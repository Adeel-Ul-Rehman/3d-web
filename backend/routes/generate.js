import express from 'express';
import { uploadMultiple } from '../middleware/upload.js';
import { generateWebsite } from '../controllers/generationController.js';

const router = express.Router();

router.post('/', uploadMultiple, generateWebsite);

export default router;
