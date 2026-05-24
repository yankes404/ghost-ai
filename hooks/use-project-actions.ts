"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import type { ProjectData } from "@/lib/types"

type DialogMode = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions() {
  const router = useRouter()
  const pathname = usePathname()

  const [mode, setMode] = useState<DialogMode>(null)
  const [targetProject, setTargetProject] = useState<ProjectData | null>(null)
  const [createName, setCreateName] = useState("")
  const [createSuffix, setCreateSuffix] = useState("")
  const [renameName, setRenameName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createSlug = createName ? `${toSlug(createName)}-${createSuffix}` : ""

  const openCreate = () => {
    setCreateName("")
    setCreateSuffix(randomSuffix())
    setMode("create")
  }

  const openRename = (project: ProjectData) => {
    setTargetProject(project)
    setRenameName(project.name)
    setMode("rename")
  }

  const openDelete = (project: ProjectData) => {
    setTargetProject(project)
    setMode("delete")
  }

  const closeDialog = () => {
    setMode(null)
    setTargetProject(null)
  }

  const handleCreate = async () => {
    if (!createSlug) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim() || "Untitled Project", id: createSlug }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      const project: ProjectData = await res.json()
      closeDialog()
      router.push(`/editor/${project.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRename = async () => {
    if (!renameName.trim() || !targetProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      })
      if (!res.ok) throw new Error("Failed to rename project")
      closeDialog()
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!targetProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      closeDialog()
      if (pathname?.startsWith(`/editor/${targetProject.id}`)) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mode,
    targetProject,
    createName,
    renameName,
    isLoading,
    createSlug,
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
