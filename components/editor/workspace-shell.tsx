"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./workspace-context";
import { ShareDialog } from "./share-dialog";

interface WorkspaceShellProps {
  projectName: string;
  projectId: string;
  isOwner: boolean;
}

export function WorkspaceShell({
  projectName,
  projectId,
  isOwner,
}: WorkspaceShellProps) {
  const {
    setProjectName,
    setProjectId,
    setIsOwner,
    isAISidebarOpen,
    isShareOpen,
    setIsShareOpen,
  } = useWorkspace();

  useEffect(() => {
    setProjectName(projectName);
    setProjectId(projectId);
    setIsOwner(isOwner);
    return () => {
      setProjectName(null);
      setProjectId(null);
      setIsOwner(false);
    };
  }, [projectName, projectId, isOwner, setProjectName, setProjectId, setIsOwner]);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-1 items-center justify-center bg-base">
        <p className="text-sm text-copy-muted">Canvas coming soon</p>
      </div>

      <aside
        className={cn(
          "fixed right-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-72 flex-col border-l border-surface-border bg-surface transition-transform duration-200",
          isAISidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-copy-muted">AI chat coming soon</p>
        </div>
      </aside>

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        projectId={projectId}
        isOwner={isOwner}
      />
    </div>
  );
}
