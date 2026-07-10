import { create } from 'zustand'

export const useGenerationStore = create((set) => ({
  currentStep: 1, // 1: Template, 2: Upload, 3: Prompt, 4: Q&A, 5: Generating, 6: Preview
  selectedTemplate: null,
  uploadedFiles: [],
  promptText: '',
  refinementAnswers: {},
  generationProgress: 0,
  generatedModelUrl: null,
  activeProjectId: null,
  projectName: '',

  setStep: (step) => set({ currentStep: step }),
  selectTemplate: (template) => set({ selectedTemplate: template, currentStep: 2 }),
  setProjectName: (name) => set({ projectName: name }),
  
  addUploadedFile: (file) => set((state) => ({ 
    uploadedFiles: [...state.uploadedFiles, file] 
  })),
  
  removeUploadedFile: (name) => set((state) => ({
    uploadedFiles: state.uploadedFiles.filter((f) => f.name !== name)
  })),
  
  setPromptText: (text) => set({ promptText: text }),
  
  setAnswer: (questionId, answer) => set((state) => ({
    refinementAnswers: { ...state.refinementAnswers, [questionId]: answer }
  })),
  
  setProgress: (progress) => set({ generationProgress: progress }),
  setGeneratedModelUrl: (url) => set({ generatedModelUrl: url }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  
  resetWizard: () => set({
    currentStep: 1,
    selectedTemplate: null,
    uploadedFiles: [],
    promptText: '',
    refinementAnswers: {},
    generationProgress: 0,
    generatedModelUrl: null,
    activeProjectId: null,
    projectName: '',
  })
}))
