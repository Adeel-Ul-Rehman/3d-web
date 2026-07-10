import { useRef, useEffect } from 'react'
import { useGenerationStore } from '../store/generationStore'
import { useProjectStore } from '../store/projectStore'

export function useGeneration() {
  const {
    generationProgress,
    setProgress,
    setGeneratedModelUrl,
  } = useGenerationStore()

  const projectStore = useProjectStore()
  const timerRef = useRef(null)

  const startSimulatedGeneration = (projectId) => {
    setProgress(0)
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      const currentProgress = useGenerationStore.getState().generationProgress
      const next = currentProgress + Math.floor(Math.random() * 15) + 5
      if (next >= 100) {
        clearInterval(timerRef.current)
        // Mark project completed in store
        projectStore.updateProjectStatus(projectId, 'Completed')
        setGeneratedModelUrl('https://modelviewer.dev/shared-assets/models/Astronaut.glb')
        setProgress(100)
      } else {
        setProgress(next)
      }
    }, 600)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return {
    startSimulatedGeneration,
    progress: generationProgress
  }
}
