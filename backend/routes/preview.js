import express from 'express';
import { getPreview } from '../controllers/previewController.js';

const router = express.Router();

router.get('/:projectId', getPreview);

export default router;
