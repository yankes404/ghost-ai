"use client"

import { useState } from "react"
import type { ProjectData } from "@/lib/types"
import { useProjectActions } from "@/hooks/use-project-actions"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogContext } from "./project-dialog-context"
import { WorkspaceProvider } from "./workspace-context"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "./project-dialogs"

interface EditorShellProps {
  children: React.ReactNode
  ownedProjects: ProjectData[]
  sharedProjects: ProjectData[]
}

export function EditorShell({
  children,
  ownedProjects,
  sharedProjects,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <WorkspaceProvider>
    <ProjectDialogContext.Provider value={{ openCreate: actions.openCreate }}>
      <div className="h-screen overflow-hidden bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={actions.openCreate}
          onRenameProject={actions.openRename}
          onDeleteProject={actions.openDelete}
        />
        <main className="h-full pt-12">{children}</main>

        <CreateProjectDialog
          open={actions.mode === "create"}
          onOpenChange={(open) => { if (!open) actions.closeDialog() }}
          name={actions.createName}
          slug={actions.createSlug}
          onNameChange={actions.setCreateName}
          onSubmit={actions.handleCreate}
          isLoading={actions.isLoading}
        />
        <RenameProjectDialog
          open={actions.mode === "rename"}
          onOpenChange={(open) => { if (!open) actions.closeDialog() }}
          project={actions.targetProject}
          name={actions.renameName}
          onNameChange={actions.setRenameName}
          onSubmit={actions.handleRename}
          isLoading={actions.isLoading}
        />
        <DeleteProjectDialog
          open={actions.mode === "delete"}
          onOpenChange={(open) => { if (!open) actions.closeDialog() }}
          project={actions.targetProject}
          onConfirm={actions.handleDelete}
          isLoading={actions.isLoading}
        />
      </div>
    </ProjectDialogContext.Provider>
    </WorkspaceProvider>
  )
}
