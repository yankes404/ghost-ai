import { prisma } from "@/lib/prisma"
import type { ProjectData } from "@/lib/types"

export async function getProjectsForUser(
  userId: string,
  userEmail: string | null,
): Promise<{ owned: ProjectData[]; shared: ProjectData[] }> {
  const [owned, shared] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
    userEmail
      ? prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: { some: { email: userEmail } },
          },
          select: { id: true, name: true },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ])

  return { owned, shared }
}
