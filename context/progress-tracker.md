# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor Canvas & React Flow Integration

## Current Goal

- Build the editor canvas using React Flow with node-based workflow visualization.

## Completed

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

## In Progress

- None yet.

## Next Up

- Build editor canvas and React Flow integration
- Set up canvas theme for React Flow nodes

## Open Questions

- Should we create additional shadcn components or are the existing ones sufficient for MVP?
- What canvas component library will be used for the shared real-time canvas?

## Architecture Decisions

- Dark-only theme with no light mode support
- CSS custom properties as the single source of truth for all design tokens
- Tailwind as the utility CSS framework with design tokens mapped via @theme inline
- Geist Sans for UI text, Geist Mono for code/mono content

## Session Notes

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
