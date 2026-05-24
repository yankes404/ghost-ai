"use client"

import { useState } from "react"

import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogContext } from "./project-dialog-context"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "./project-dialogs"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <ProjectDialogContext.Provider value={{ openCreate: dialogs.openCreate }}>
      <div className="h-screen overflow-hidden bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={dialogs.openCreate}
          onRenameProject={dialogs.openRename}
          onDeleteProject={dialogs.openDelete}
        />
        <main className="h-full pt-12">{children}</main>

        <CreateProjectDialog
          open={dialogs.mode === "create"}
          onOpenChange={(open) => { if (!open) dialogs.closeDialog() }}
          name={dialogs.createName}
          slug={dialogs.createSlug}
          onNameChange={dialogs.setCreateName}
          onSubmit={dialogs.handleCreate}
          isLoading={dialogs.isLoading}
        />
        <RenameProjectDialog
          open={dialogs.mode === "rename"}
          onOpenChange={(open) => { if (!open) dialogs.closeDialog() }}
          project={dialogs.targetProject}
          name={dialogs.renameName}
          onNameChange={dialogs.setRenameName}
          onSubmit={dialogs.handleRename}
          isLoading={dialogs.isLoading}
        />
        <DeleteProjectDialog
          open={dialogs.mode === "delete"}
          onOpenChange={(open) => { if (!open) dialogs.closeDialog() }}
          project={dialogs.targetProject}
          onConfirm={dialogs.handleDelete}
          isLoading={dialogs.isLoading}
        />
      </div>
    </ProjectDialogContext.Provider>
  )
}
