import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: {
    name: 'Alex Jade',
    email: 'alex.jade@example.com',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex+Jade',
  },
  currentScreen: 'LANDING', // LANDING, DASHBOARD, TEMPLATE_GALLERY, ASSET_UPLOAD, PROMPT_ENTRY, QA_SESSION, GENERATION_PROGRESS, PREVIEW_DELIVERY
  setScreen: (screen) => set({ currentScreen: screen }),
}))
