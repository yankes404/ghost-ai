"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ProjectData } from "@/lib/types"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  slug: string
  onNameChange: (name: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  slug,
  onNameChange,
  onSubmit,
  isLoading,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            autoFocus
          />
          {slug && (
            <p className="text-xs text-copy-muted">
              Room ID:{" "}
              <span className="font-mono text-copy-secondary">{slug}</span>
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={onSubmit} disabled={!slug || isLoading}>
            {isLoading ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RenameProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectData | null
  name: string
  onNameChange: (name: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  project,
  name,
  onNameChange,
  onSubmit,
  isLoading,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          {project && (
            <DialogDescription>
              Currently named{" "}
              <span className="font-medium text-copy-secondary">
                {project.name}
              </span>
              .
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          placeholder="New project name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          autoFocus
        />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={onSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? "Saving…" : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: ProjectData | null
  onConfirm: () => void
  isLoading: boolean
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
  onConfirm,
  isLoading,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            {project && (
              <>
                <span className="font-medium text-copy-secondary">
                  {project.name}
                </span>{" "}
                will be permanently deleted. This cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
