import { create } from 'zustand'

export const useProjectStore = create((set) => ({
  projects: [
    {
      id: 'proj-1',
      name: 'Neon Cyber Drone',
      template: 'Drone / Vehicle',
      status: 'Completed',
      createdAt: 'Jul 08, 2026',
      image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=400&q=80',
      vertices: '84,204',
      triangles: '168k',
      textures: '4K PBR',
    },
    {
      id: 'proj-2',
      name: 'Sci-Fi Assault Rifle',
      template: 'Hard Surface Prop',
      status: 'Completed',
      createdAt: 'Jul 09, 2026',
      image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=400&q=80',
      vertices: '32,150',
      triangles: '62k',
      textures: '2K PBR',
    },
    {
      id: 'proj-3',
      name: 'Relic Sword',
      template: 'Melee Weapon',
      status: 'Generating',
      createdAt: 'Jul 10, 2026',
      image: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&w=400&q=80',
      vertices: '12,045',
      triangles: '24k',
      textures: '2K PBR',
    }
  ],
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  })),
  updateProjectStatus: (id, status) => set((state) => ({
    projects: state.projects.map((p) => p.id === id ? { ...p, status } : p)
  }))
}))
