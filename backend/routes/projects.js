import express from 'express';
import { listProjects, getProject, removeProject } from '../controllers/projectsController.js';

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProject);
router.delete('/:id', removeProject);

export default router;
