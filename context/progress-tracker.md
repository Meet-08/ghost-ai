# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor Workspace Canvas

## Current Goal

- Add shape-specific canvas visuals and richer edge rendering on top of the basic custom node renderer.

## Completed

- ✅ Updated AI sidebar behavior in the editor workspace shell
  - Changed the AI sidebar in `/editor/$projectId` to overlay the canvas from the right
  - Removed layout-width consumption so opening AI no longer shrinks canvas space
  - Kept desktop-only visibility and existing toggle behavior

- ✅ Updated `styles.css` with Ghost AI dark theme design system
  - Defined all CSS custom properties for backgrounds, borders, text, and accents
  - Mapped design tokens to Tailwind color palette
  - Set up proper font loading for Geist Sans and Geist Mono
  - Configured dark-only color scheme with proper contrast ratios
  - Implemented scrollbar styling matching the theme
  - Added accessibility focus ring styling
- ✅ Verified existing shadcn components (button, card, input, dialog, tabs, textarea, scroll-area)
  - All components use Tailwind design tokens (primary, secondary, muted, accent, etc.)
  - Components automatically use the dark theme via CSS custom properties
- ✅ Created editor navbar component (`components/editor/editor-navbar.tsx`)
  - Fixed-height top navbar with dark background and subtle border
  - Left section with sidebar toggle button (PanelLeftOpen/PanelLeftClose icons)
  - Center and right sections ready for future content
  - TypeScript typed with sidebar state props
  - Added UserButton for profile and logout
- ✅ Created project sidebar component (`components/editor/project-sidebar.tsx`)
  - Floats above canvas with overlay
  - Slides in from left without pushing content
  - Header with Projects title and close button
  - Tabs for "My Projects" and "Shared" with empty state placeholders
  - Full-width New Project button with Plus icon
- ✅ Hardened project sidebar focus behavior when closed
  - Added `aria-hidden` and `inert` to keep the mounted shell out of keyboard focus
  - Removed sidebar controls from the tab order while closed
- ✅ Set up dialog pattern (`components/editor/dialog-pattern.tsx`)
  - Reusable DialogPattern component with title, description, footer
  - Re-exports all dialog primitives for flexibility
  - Ready for future dialog implementations
- ✅ Implemented Clerk authentication
  - Installed @clerk/ui for Clerk components
  - Created ClerkProvider wrapper with dark theme in `integrations/clerk/provider.tsx`
  - Built sign-in page (`/sign-in`) with responsive two-panel layout
  - Built sign-up page (`/sign-up`) with responsive two-panel layout
  - Created editor page (`/editor`) with navbar, sidebar, and canvas placeholder
  - Set up root redirect logic: authenticated users → /editor, unauthenticated → /sign-in
  - Integrated UserButton into editor navbar for profile management and logout
  - Used Clerk's dark theme from @clerk/ui/themes as base
  - Applied CSS custom properties for form styling (no hardcoded colors)
  - Leveraged clerkMiddleware() in start.ts for server-side auth handling
- ✅ Built the `/editor` home screen and project dialog flow
  - Added the centered editor home prompt and `New Project` action
  - Wired mock create, rename, and delete dialogs with live slug preview on create
  - Added owned-project rename/delete actions in the sidebar and hid them for shared projects
  - Kept all project state in-memory with a dedicated hook and no persistence or API calls
- ✅ Implemented backend project API routes
  - Added `GET /api/projects` to list projects owned by the authenticated Clerk user
  - Added `POST /api/projects` to create a project with `ownerId` from Clerk auth
  - Defaulted missing/empty project names to `Untitled Project` on create
  - Added `PATCH /api/projects/$projectId` to rename projects with strict owner enforcement
  - Added `DELETE /api/projects/$projectId` to delete projects with strict owner enforcement
  - Added consistent JSON auth helpers for `401 Unauthorized` and `403 Forbidden` responses
  - Verified the implementation compiles successfully with `bun run build`

- ✅ Implemented `/editor/[roomId]` workspace shell
  - Added server-side workspace loading with Clerk identity lookup and project access checks
  - Redirected unauthenticated users to `/sign-in` before rendering protected workspace data
  - Added owner/collaborator access helper logic in `src/lib/project-access.ts`
  - Added `AccessDenied` for missing or unauthorized projects
  - Rendered full-viewport workspace with project name navbar, share action, AI sidebar toggle, left project sidebar, canvas placeholder, and AI placeholder sidebar
  - Highlighted the current room in the project sidebar and preserved project dialogs in the workspace shell
  - Verified new workspace code with `bunx tsc --noEmit`; remaining errors are pre-existing `prisma/seed.ts` references to a removed `todo` model

- ✅ Fixed `/editor/$projectId` nested route rendering so child workspace routes render instead of the `/editor` home screen
  - Added an outlet handoff in `src/routes/editor.tsx` for non-`/editor` paths
  - Confirmed targeted Biome checks pass for the affected route/access files
  - Confirmed `bunx tsc --noEmit` remains blocked only by the pre-existing `prisma/seed.ts` `todo` model mismatch

- ✅ Implemented editor share dialog
  - Added a navbar `Share` action that opens the project share dialog from `/editor/$projectId`
  - Added collaborator listing, invite, and remove API logic under `/api/projects/$projectId/collaborators`
  - Enforced authenticated project access for listing and owner-only access for invite/remove
  - Enriched collaborator emails with Clerk display names and avatar images when available
  - Added owner invite/remove controls, collaborator read-only access, and copy-link `Copied!` feedback
  - Verified targeted Biome checks pass and `bun run build` passes

- ✅ Fixed shared projects missing from the `/editor` sidebar
  - Updated the `/editor` loader to use access-aware project listing instead of owner-only loading
  - Updated `GET /api/projects` to return both owned and collaborator projects with access metadata
  - Kept sidebar tab filtering unchanged: owner projects appear under "My Projects", collaborator projects under "Shared"

- ✅ Implemented Liveblocks server glue: presence types, client helpers, and auth route
  - Added `cursor` and `isThinking` to `Presence` in `liveblocks.config.ts`
  - Added `UserMeta` fields for `displayName`, `avatarUrl`, and `cursorColor` in `liveblocks.config.ts`
  - Created `src/lib/liveblocks.ts` with a cached-style REST helper, deterministic color mapping, `ensureRoomExists()` and `createSessionForRoom()` helpers
  - Implemented `POST /api/liveblocks-auth` at `src/routes/api/liveblocks-auth.ts` which requires Clerk auth, verifies project access, ensures the Liveblocks room, and returns a session token with user metadata
- ✅ Fixed Liveblocks auth to use the documented `prepareSession()` / `authorize()` flow
  - Switched the auth route to `@liveblocks/node` so room access is granted directly during authorization
  - Removed the brittle manual room precreation REST call that was returning 404s
  - Kept the same Clerk-backed project access checks and user metadata enrichment
- ✅ Replaced the editor workspace placeholder with a Liveblocks-backed React Flow canvas foundation
  - Added shared canvas contracts in `src/types/canvas.ts` for node data, node color palette, node shapes, and custom canvas node/edge type names
  - Built a client-side editor canvas wrapper that sets up `LiveblocksProvider`, `RoomProvider`, `ClientSideSuspense`, loading, and connection error states
  - Wired `useLiveblocksFlow` into React Flow with empty initial nodes and edges, loose connections, fit view, minimap, and a dot-pattern background
  - Swapped the `/editor/$projectId` placeholder for the collaborative canvas while keeping the workspace page server-rendered
  - Verified the feature with `bun run build` and a targeted `bunx biome check` on the touched files

- ✅ Added the bottom shape panel and basic canvas node renderer
  - Added draggable shape buttons for rectangle, diamond, circle, pill, cylinder, and hexagon
  - Added drag payloads with the shape name and default size so drops can create new nodes
  - Added canvas drop handling that converts screen coordinates to flow coordinates and creates a new node with the custom canvas node type
  - Rendered custom canvas nodes as simple bordered rectangles with the label centered
  - Verified with `bun run build`
  - Updated node ID generation to use the shape name, timestamp, and counter as specified

## In Progress

- Shape-specific canvas visuals and richer edge rendering

## Next Up

- Add shape-specific canvas visuals and richer edge rendering when the design calls for it

## Open Questions

- Should we create additional shadcn components or are the existing ones sufficient for MVP?
- What canvas component library will be used for the shared real-time canvas?

## Architecture Decisions

- Dark-only theme with no light mode support
- CSS custom properties as the single source of truth for all design tokens
- Tailwind as the utility CSS framework with design tokens mapped via @theme inline
- Geist Sans for UI text, Geist Mono for code/mono content

## Session Notes

- AI sidebar in `/editor/$projectId` now overlays above the canvas (absolute positioned, slide-in) instead of taking flex layout space.

- Fixed `/editor/$projectId` rendering by allowing the `/editor` parent route to render its child outlet for nested workspace URLs, so unauthorized project URLs can reach `AccessDenied`.
- Completed feature spec `08-editor-workspace-shell.md`: shell/access behavior is implemented; full build is blocked in the sandbox by Bun/Vite native dependency access, and `bunx tsc --noEmit` is blocked only by pre-existing seed errors.
- Completed feature spec `09-share-dialog.md`: share dialog, collaborator APIs, Clerk profile enrichment, and owner/collaborator permission split are implemented; `bun run build` passes when run outside the sandbox.
- Fixed `/editor` home sidebar project loading so shared collaborator projects appear in the Shared tab.
- Geist fonts imported from @fontsource packages for proper font loading
- Design system colors follow the UI context specification exactly
- All components use design tokens, no hardcoded colors
- Focus rings implemented for accessibility (2px solid cyan accent)
- Clerk integration complete: dark theme applied with CSS custom properties
- Auth routing implemented with client-side redirect logic (useAuth + useNavigate)
- ClerkProvider wraps root with dark theme and afterSignOutUrl callback
- Public routes: /sign-in, /sign-up; protected: /, /editor (all others by default)
- UserButton integrated into editor navbar for user profile and logout
- Editor project management is now handled with a local in-memory hook and mock project data only
- Editor project loading now uses a server-only helper that queries Prisma after Clerk auth
