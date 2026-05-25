"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "./workspace-context";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
}: EditorNavbarProps) {
  const { projectName, isAISidebarOpen, setIsAISidebarOpen, setIsShareOpen } = useWorkspace();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-surface-border bg-surface px-3">
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        {projectName && (
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-copy-primary">
              {projectName}
            </span>
            <span className="text-xs text-copy-muted mt-1">Workspace</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {projectName && (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              size="sm"
              className="bg-accent-dim text-brand hover:bg-accent-dim/80 border border-brand/20"
              onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
              aria-label="Toggle AI sidebar"
              aria-pressed={isAISidebarOpen}
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  );
}
