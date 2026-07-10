export const CONSTANTS = {
  MAX_ITERATIONS: parseInt(process.env.MAX_ITERATIONS) || 3,
  QUALITY_THRESHOLD: parseInt(process.env.QUALITY_THRESHOLD) || 85,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
  GENERATED_PATH: process.env.GENERATED_FILES_PATH || './generated',
  UPLOADS_PATH: process.env.UPLOADS_PATH || './uploads',
  DEVTOOLBOX_URL: process.env.DEVTOOLBOX_URL || 'https://devtoolbox.vercel.app/api/ai',
  KRIZVIBE_URL: process.env.KRIZVIBE_URL || 'https://api.krizvibe.com/v1/generate',
};

export const STATUS = {
  PENDING: 'pending',
  GENERATING: 'generating',
  VALIDATING: 'validating',
  COMPLETED: 'completed',
  FAILED: 'failed',
};
