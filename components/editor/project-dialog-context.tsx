"use client"

import { createContext, useContext } from "react"

interface ProjectDialogContextValue {
  openCreate: () => void
}

export const ProjectDialogContext = createContext<ProjectDialogContextValue>({
  openCreate: () => {},
})

export function useProjectDialog() {
  return useContext(ProjectDialogContext)
}
