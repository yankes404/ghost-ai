import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { EditorShell } from "@/components/editor/editor-shell"
import { getProjectsForUser } from "@/lib/data/projects"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const email = user.emailAddresses[0]?.emailAddress ?? null
  const { owned, shared } = await getProjectsForUser(user.id, email)

  return (
    <EditorShell ownedProjects={owned} sharedProjects={shared}>
      {children}
    </EditorShell>
  )
}
