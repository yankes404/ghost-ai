import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function getCurrentIdentity(): Promise<{
  userId: string
  email: string | null
} | null> {
  const user = await currentUser()
  if (!user) return null
  return {
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? null,
  }
}

export async function getAccessibleProject(
  projectId: string,
  userId: string,
  email: string | null,
): Promise<{ id: string; name: string; ownerId: string } | null> {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        ...(email ? [{ collaborators: { some: { email } } }] : []),
      ],
    },
    select: { id: true, name: true, ownerId: true },
  })
}
