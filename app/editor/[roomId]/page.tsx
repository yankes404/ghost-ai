import { redirect } from "next/navigation"
import { getCurrentIdentity, getAccessibleProject } from "@/lib/project-access"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"

export default async function EditorRoomPage(props: PageProps<"/editor/[roomId]">) {
  const { roomId } = await props.params

  const identity = await getCurrentIdentity()
  if (!identity) redirect("/sign-in")

  const project = await getAccessibleProject(roomId, identity.userId, identity.email)
  if (!project) return <AccessDenied />

  return (
    <WorkspaceShell
      projectName={project.name}
      projectId={roomId}
      isOwner={project.ownerId === identity.userId}
    />
  )
}
