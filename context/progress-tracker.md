# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 09: Share dialog — completed

## Current Goal

- Next planned feature unit.

## Completed

- 01-design-system: shadcn/ui configured (Nova preset, Tailwind v4), components installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, lib/utils.ts with cn() helper created, dark theme active via `.dark` class on html element.
- 02-editor-chrome: EditorNavbar and ProjectSidebar shell components created in `components/editor/`.
- 03-auth: @clerk/ui installed; ClerkProvider with dark theme wraps root layout; proxy.ts created (clerkMiddleware, all routes protected except /sign-in and /sign-up); sign-in and sign-up pages at app/(auth)/sign-in/[[...sign-in]] and app/(auth)/sign-up/[[...sign-up]] with two-panel layout (left: logo + tagline + features, right: Clerk form; mobile: form only); home page (/) redirects authenticated users to /editor and unauthenticated to /sign-in; UserButton added to editor navbar right section.
- 04-dialogs: Editor home screen, project dialogs (Create/Rename/Delete), sidebar project actions with owned/shared distinction, mobile backdrop scrim, useProjectDialogs hook.
- 05-prisma: Project and ProjectCollaborator models in `prisma/models/project.prisma`; migration `20260524194303_init` applied; Prisma Client generated to `app/generated/prisma`; `lib/prisma.ts` singleton with URL branching — `prisma+postgres://` uses built-in `accelerateUrl`, otherwise uses `@prisma/adapter-pg` with direct connection string.
- 06-project-apis: REST endpoints at `app/api/projects/route.ts` (GET list, POST create) and `app/api/projects/[projectId]/route.ts` (GET, PATCH rename, DELETE); Clerk `auth()` enforces 401 for unauthenticated; owner check enforces 403 for non-owner mutations; default name "Untitled Project"; build passes.
- 07-wire-editor-home: `lib/types.ts` defines `ProjectData`; `lib/data/projects.ts` server helper fetches owned + shared projects via Prisma; `app/editor/layout.tsx` is a server component that calls `currentUser()` and passes project lists to `EditorShell`; `hooks/use-project-actions.ts` replaces stub with real `fetch` calls (POST create with slug ID, PATCH rename with refresh, DELETE with redirect-or-refresh); POST route extended to accept optional custom `id`; sidebar and dialogs updated to use `ProjectData` instead of `MockProject`; create dialog shows room ID preview; build passes.
- 08-editor-workspace-shell: `lib/project-access.ts` exposes `getCurrentIdentity()` and `getAccessibleProject()`; `app/editor/[roomId]/page.tsx` is a server component — unauthenticated redirects to `/sign-in`, missing/unauthorized projects render `AccessDenied`; `components/editor/access-denied.tsx` shows lock icon + message + link back to `/editor`; `components/editor/workspace-shell.tsx` client component renders workspace header (project name, Share button, AI sidebar toggle) + dark canvas placeholder + collapsible AI sidebar placeholder; `ProjectSidebar` project items are now `<Link>` elements that highlight the active room via `usePathname`; build passes with no TypeScript errors.
- 09-share-dialog: `app/api/projects/[projectId]/collaborators/route.ts` — GET (list, Clerk-enriched), POST (invite, owner-only), DELETE (remove, owner-only); `components/editor/share-dialog.tsx` — owner view shows invite form + collaborator list with remove buttons, collaborator view is read-only, copy-link button with Copied! feedback, avatars from Clerk with initials fallback; `WorkspaceContext` extended with `projectId`, `isOwner`, `isShareOpen`/`setIsShareOpen`; `WorkspaceShell` sets context and renders dialog; Share button in `EditorNavbar` opens dialog; `getAccessibleProject` now returns `ownerId`.

## In Progress

- None.

## Next Up

- Feature 10: next planned feature unit.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui base-nova preset used (Radix + Lucide + Geist). Tailwind v4 CSS variable approach. Dark mode via `.dark` class (not media query).

## Session Notes

- Add context needed to resume work in the next session.
