// In-memory project storage (mock database — swap for MongoDB later)
const projects = [];

export const getAllProjects = () => [...projects];

export const getProjectById = (id) => projects.find(p => p.id === id);

export const createProject = (projectData) => {
  const project = {
    id: projectData.id || `proj_${Date.now()}`,
    name: projectData.name || 'Untitled',
    category: projectData.category || 'General',
    date: new Date().toISOString().slice(0, 10),
    score: projectData.score || 0,
    thumbnail: projectData.thumbnail || '🎮',
    previewUrl: projectData.previewUrl || null,
    downloadUrl: projectData.downloadUrl || null,
    iterations: projectData.iterations || 1,
    issues: projectData.issues || [],
    ...projectData,
  };
  projects.unshift(project);
  return project;
};

export const deleteProject = (id) => {
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects.splice(index, 1);
    return true;
  }
  return false;
};

export const updateProject = (id, data) => {
  const project = projects.find(p => p.id === id);
  if (project) {
    Object.assign(project, data);
    return project;
  }
  return null;
};
