import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const generateProjectId = () => {
  return `proj_${uuidv4().slice(0, 8)}`;
};

export const generateTimestamp = () => {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
};

export const sanitizeFilename = (name) => {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
};

export const parseGeneratedCode = (response) => {
  let html = '';
  let css = '';
  let js = '';
  const text = typeof response === 'string' ? response : JSON.stringify(response);

  const htmlMatch = text.match(/```html\s*([\s\S]*?)```/i);
  const cssMatch = text.match(/```css\s*([\s\S]*?)```/i);
  const jsMatch = text.match(/```(?:js|javascript)\s*([\s\S]*?)```/i);

  if (htmlMatch) html = htmlMatch[1].trim();
  if (cssMatch) css = cssMatch[1].trim();
  if (jsMatch) js = jsMatch[1].trim();

  if (!html) {
    const htmlTagMatch = text.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
    if (htmlTagMatch) html = htmlTagMatch[0].trim();
  }

  return { html, css, js };
};

export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

export const isImageFile = (filename) => {
  const ext = getFileExtension(filename);
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
};

export const is3DModelFile = (filename) => {
  const ext = getFileExtension(filename);
  return ['.glb', '.gltf', '.obj', '.fbx'].includes(ext);
};
