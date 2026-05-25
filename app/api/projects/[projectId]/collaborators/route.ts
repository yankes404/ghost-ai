import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface PersonData {
  email: string;
  name: string | null;
  imageUrl: string | null;
}

async function enrichWithClerk(emails: string[]): Promise<Map<string, PersonData>> {
  const map = new Map<string, PersonData>();
  if (emails.length === 0) return map;
  try {
    const clerk = await clerkClient();
    const result = await clerk.users.getUserList({ emailAddress: emails });
    for (const u of result.data) {
      for (const e of u.emailAddresses) {
        map.set(e.emailAddress, {
          email: e.emailAddress,
          name: u.fullName ?? u.firstName ?? u.username ?? null,
          imageUrl: u.imageUrl ?? null,
        });
      }
    }
  } catch {
    // fall back to email-only
  }
  return map;
}

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators">,
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await ctx.params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: { orderBy: { createdAt: "asc" } } },
  });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  const isOwner = project.ownerId === userId;

  if (!isOwner) {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress ?? null;
    const isCollaborator = userEmail
      ? project.collaborators.some((c) => c.email === userEmail)
      : false;
    if (!isCollaborator) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const collaboratorEmails = project.collaborators.map((c) => c.email);

  // Get owner email from Clerk
  const clerk = await clerkClient();
  const ownerClerk = await clerk.users.getUser(project.ownerId);
  const ownerEmail = ownerClerk.emailAddresses[0]?.emailAddress ?? "";

  const allEmails = [ownerEmail, ...collaboratorEmails].filter(Boolean);
  const enriched = await enrichWithClerk(allEmails);

  const owner: PersonData = enriched.get(ownerEmail) ?? {
    email: ownerEmail,
    name: ownerClerk.fullName ?? ownerClerk.firstName ?? ownerClerk.username ?? null,
    imageUrl: ownerClerk.imageUrl ?? null,
  };

  const collaborators: PersonData[] = collaboratorEmails.map((email) =>
    enriched.get(email) ?? { email, name: null, imageUrl: null },
  );

  return Response.json({ owner, collaborators, isOwner });
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators">,
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email: string = (body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  const clerk = await clerkClient();
  const ownerClerk = await clerk.users.getUser(userId);
  const ownerEmail = ownerClerk.emailAddresses[0]?.emailAddress ?? "";
  if (email === ownerEmail.toLowerCase()) {
    return Response.json(
      { error: "Owner cannot be added as collaborator" },
      { status: 400 },
    );
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  });
  if (existing) {
    return Response.json({ error: "Already a collaborator" }, { status: 409 });
  }

  const collaborator = await prisma.projectCollaborator.create({
    data: { projectId, email },
  });

  return Response.json(collaborator, { status: 201 });
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/projects/[projectId]/collaborators">,
) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email: string = (body.email ?? "").trim().toLowerCase();
  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  await prisma.projectCollaborator.deleteMany({
    where: { projectId, email },
  });

  return new Response(null, { status: 204 });
}
