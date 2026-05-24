The database schema is ready. Build the backend project API routes only.

## Routes

Create REST endpoints for:

- `GET /api/projects` , list current user's projects
- `POST /api/projects` , create a new project
- `PATCH /api/projects/[projectId]` , rename a project by id
- `DELETE /api/projects/[projectId]` , delete a project by id

## Rules

Use the authenticated clerk user ID as the `ownerId`.

When creating:

- default missing project name to `Untitled Project`
- Use the schema's existing ID strategy. Do not add sequential IDs.

Security:

- unauthenticated requests return `401`
- only the project owner can rename or delete
- non-owner mutations return `403`

Keep this backend only. Do not wire the UI yet.

## Check When Done

- Routes exist for List, Create, Rename, and Delete.
- Owner checks are enforced for rename or delete.
- `401` and `403` Responses are handled correctly.
- `npm run build` passes.
