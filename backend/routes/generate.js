import express from 'express';
import { uploadMultiple } from '../middleware/upload.js';
import { generateWebsite, getDynamicQuestions } from '../controllers/generationController.js';

const router = express.Router();

router.post('/', uploadMultiple, generateWebsite);
router.post('/questions', getDynamicQuestions);

export default router;
