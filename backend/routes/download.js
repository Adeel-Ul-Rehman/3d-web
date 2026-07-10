import express from 'express';
import { downloadProject } from '../controllers/downloadController.js';

const router = express.Router();

router.get('/:projectId', downloadProject);

export default router;
