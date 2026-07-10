export function useValidation() {
  const validatePrompt = (prompt) => {
    if (!prompt || prompt.trim().length < 5) {
      return 'Prompt must be at least 5 characters long to describe the object detail.'
    }
    return null
  }

  const validateProjectName = (name) => {
    if (!name || name.trim().length < 3) {
      return 'Project name must be at least 3 characters long.'
    }
    return null
  }

  return {
    validatePrompt,
    validateProjectName
  }
}
