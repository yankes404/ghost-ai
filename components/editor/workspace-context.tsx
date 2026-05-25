"use client"

import { createContext, useContext, useState } from "react"

interface WorkspaceContextValue {
  projectName: string | null
  setProjectName: (name: string | null) => void
  projectId: string | null
  setProjectId: (id: string | null) => void
  isOwner: boolean
  setIsOwner: (owner: boolean) => void
  isAISidebarOpen: boolean
  setIsAISidebarOpen: (open: boolean) => void
  isShareOpen: boolean
  setIsShareOpen: (open: boolean) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [projectName, setProjectName] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <WorkspaceContext.Provider
      value={{
        projectName,
        setProjectName,
        projectId,
        setProjectId,
        isOwner,
        setIsOwner,
        isAISidebarOpen,
        setIsAISidebarOpen,
        isShareOpen,
        setIsShareOpen,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider")
  return ctx
}
