import { getAllProjects, getProjectById, deleteProject } from '../models/projectModel.js';
import { deleteProjectDirectory } from '../services/fileService.js';

export const listProjects = (req, res) => {
  const projects = getAllProjects();
  res.json({ success: true, count: projects.length, projects });
};

export const getProject = (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({
      success: false,
      error: { message: 'Project not found' },
    });
  }
  res.json({ success: true, project });
};

export const removeProject = async (req, res, next) => {
  try {
    const project = getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' },
      });
    }
    deleteProject(req.params.id);
    try { await deleteProjectDirectory(req.params.id); } catch (_) {}
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
