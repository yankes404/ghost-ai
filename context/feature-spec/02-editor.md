We need the base chrome components that frame every Editor Screen: the top NavBar and the left sidebar shell. This will be used and extended in every chapter that follows.

### Editor Navbar

Create `components/editor/editor-navbar.tsx`.

Requirements:

- fixed-height top navbar
- left, center, and right sections
- left section contains sidebar toggle button
- Use `PanelLeftOpen` / `PanelLeftClose` icons based on the sidebar state
- The right section stays empty for now
- Dark background with subtle button border

### Project Sidebar

Create `components/editor/project-sidebar.tsx`.

Requirements:

- sidebar should float above the editor canvas
- opening it should not push page content
- slides in from the left
- accepts `isOpen` prop
- header with `Projects` title + close button
- shadcn `Tabs`:
  - My Projects
  - Shared
- both tabs show empty placeholder state
- full-width `New Project` button at the bottom with `Plus` icon

### Dialog Pattern

Use the existing color tokens from `globals.css` for dialog styling.

Support:

- title
- description
- footer actions.

Do not build actual dialogs yet.

### Check when done

New components compiled without TypeScript errors, no link errors. Dialog pattern is ready for future use.
