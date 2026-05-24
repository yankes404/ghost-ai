"use client"

import { useEffect, useRef, useState } from "react"
import type { MockProject } from "@/lib/mock-projects"

type DialogMode = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function useProjectDialogs() {
  const [mode, setMode] = useState<DialogMode>(null)
  const [targetProject, setTargetProject] = useState<MockProject | null>(null)
  const [createName, setCreateName] = useState("")
  const [renameName, setRenameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const timers = timersRef.current
    return () => { timers.forEach(clearTimeout) }
  }, [])

  const openCreate = () => {
    setCreateName("")
    setMode("create")
  }

  const openRename = (project: MockProject) => {
    setTargetProject(project)
    setRenameName(project.name)
    setMode("rename")
  }

  const openDelete = (project: MockProject) => {
    setTargetProject(project)
    setMode("delete")
  }

  const closeDialog = () => {
    setMode(null)
    setTargetProject(null)
  }

  const handleCreate = () => {
    if (!toSlug(createName)) return
    setIsLoading(true)
    timersRef.current.push(setTimeout(() => {
      setIsLoading(false)
      closeDialog()
    }, 400))
  }

  const handleRename = () => {
    if (!renameName.trim()) return
    setIsLoading(true)
    timersRef.current.push(setTimeout(() => {
      setIsLoading(false)
      closeDialog()
    }, 400))
  }

  const handleDelete = () => {
    setIsLoading(true)
    timersRef.current.push(setTimeout(() => {
      setIsLoading(false)
      closeDialog()
    }, 400))
  }

  return {
    mode,
    targetProject,
    createName,
    renameName,
    isLoading,
    createSlug: toSlug(createName),
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setCreateName,
    setRenameName,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
