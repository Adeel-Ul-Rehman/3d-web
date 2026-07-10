// Central API service for MobileFirst3D
// All backend calls go through here so base URL is one place to change

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Generate Website ───────────────────────────────────────────────────────
export const generateWebsite = async ({ template, prompt, answers, files = [] }) => {
  const formData = new FormData();
  formData.append('template', JSON.stringify(template || {}));
  formData.append('prompt', JSON.stringify(prompt || {}));
  formData.append('answers', JSON.stringify(answers || {}));
  files.forEach(file => formData.append('files', file));

  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || `Generation failed (${res.status})`);
  }
  return data;
};

// ─── Generate Dynamic Q&A Questions ─────────────────────────────────────────
export const fetchDynamicQuestions = async ({ template, prompt }) => {
  const res = await fetch(`${BASE_URL}/api/generate/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ template, prompt }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || 'Failed to generate dynamic questions');
  }
  return data.questions;
};

// ─── Preview URL ─────────────────────────────────────────────────────────────
export const getPreviewUrl = (projectId) =>
  `${BASE_URL}/api/preview/${projectId}`;

// ─── Download URL ─────────────────────────────────────────────────────────────
export const getDownloadUrl = (projectId) =>
  `${BASE_URL}/api/download/${projectId}`;

// ─── Projects ─────────────────────────────────────────────────────────────────
export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/api/projects`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error?.message || 'Failed to fetch projects');
  return data.projects;
};

export const fetchProject = async (id) => {
  const res = await fetch(`${BASE_URL}/api/projects/${id}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error?.message || 'Project not found');
  return data.project;
};

export const deleteProject = async (id) => {
  const res = await fetch(`${BASE_URL}/api/projects/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error?.message || 'Delete failed');
  return data;
};

// ─── Health Check ─────────────────────────────────────────────────────────────
export const checkHealth = async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  return res.json();
};
