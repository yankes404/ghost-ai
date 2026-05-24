"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProjectDialog } from "@/components/editor/project-dialog-context";

export default function EditorPage() {
  const { openCreate } = useProjectDialog();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h1 className="text-lg font-semibold text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="text-sm text-copy-muted">
        Start a new architecture workspace or choose a project from the sidebar.
      </p>
      <Button onClick={openCreate} className="mt-2">
        <Plus className="h-5 w-5" />
        New Project
      </Button>
    </div>
  );
}
