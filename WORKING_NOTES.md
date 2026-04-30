# Working Notes — Responsiboard

Running log of decisions, issues, and session notes for the Responsiboard prototype.

---

## Session Log

### Session 1 — Initial Build
**What was built:**
- Scaffolded full React + Vite app with Tailwind CSS v4, shadcn/ui, wouter routing, Framer Motion
- Built 3 core pages: Landing, Projects, New Project
- Applied bold Option B design — deep navy, electric blue, vibrant green CTAs
- Inspired by Linear.app and Vercel dashboard aesthetics
- Added Inter font via Google Fonts (imported as first line of index.css per PostCSS rules)
- Scroll animations on landing page hero and feature cards using `framer-motion`

**Design choices made:**
- Primary background: `hsl(225 50% 8%)` — deep navy, not pure black
- CTA green chosen for high contrast against dark backgrounds, matches "vibrant" brief
- Cards use `hsl(225 40% 12%)` for slight surface lift, subtle shadow
- All buttons use rounded-full (pills) or rounded-xl — no sharp edges

---

### Session 2 — Login + Search Friends
**What was added:**
- `/login` page with email + password form, show/hide password toggle, loading state, error validation
- `/search-friends` page with live search, color-coded avatar initials, Add/Added toggle state, mutual friends count
- Updated `App.tsx` routing: `/login` now points to real Login component (was redirecting to Landing)
- Updated `Header.tsx`: "Search Friends" nav link corrected from `/search` to `/search-friends`
- Landing page CTAs updated: "Log in", "Get Started", "Start a Project", "Create Your First Project" all now route to `/login` instead of directly to `/projects`
- Logout button in Header now navigates back to `/login`

**User flow established:**
```
Landing → Login → Projects → (Search Friends | New Project)
```

---

### Session 3 — Making Buttons Work
**Problem reported:** Open buttons and Next button on Projects page did nothing. Action buttons on New Project page did nothing.

**Fixes applied:**

*Projects page:*
- "Open" buttons now animate the selected card and navigate to `/new-project` after a short delay (simulates opening a project)
- "Next" button now paginates — 5 total sample projects, 3 shown at a time, Next cycles through pages
- Added progress bars under each project card
- Added pagination counter ("Page 1 of 2 — 5 total projects")

*New Project page:*
- All 4 action buttons converted from static to expandable accordion sections
- **Invite Friends** — email input + add button, builds a list of invited teammates
- **Set Deadlines** — milestone label + date picker, stacks added deadlines below
- **Upload Documents** — drag-and-drop area with file input, shows uploaded filenames
- **Workload Checklist** — add tasks, check them off (strikethrough), delete with ×
- Buttons show a green badge count when items have been added to that section
- "Create" button already worked (navigates to `/projects`)

---

## Known Limitations (Prototype)

- **No real auth** — login accepts any email and password, no validation against a database
- **No persistence** — all state is in-memory (React `useState`). Refreshing the page resets everything
- **No backend** — projects, friends, deadlines are all static mock data
- **No real file uploads** — the upload section captures filenames from the browser's file picker but does not send files anywhere
- **No real invites** — entering emails in "Invite Friends" adds them to a local list only; no emails are sent
- **No signup flow** — "Sign up free" and "Create a free account" links exist but have no destination page yet

---

## Usability Test Findings (from original research)

| Issue | Status | Fix Applied |
|---|---|---|
| Users tried to create project before adding friends | Noted | Friends search accessible from nav before project creation |
| Notes section purpose was unclear | Fixed | Placeholder text now shows examples ("I'll be out of town next week...") |
| Navigation order: add friends → create project | Noted | "Search Friends" appears before "Projects" is started |

---

## Future Improvements (if this moves to a real product)

- [ ] Real authentication (email/password + OAuth)
- [ ] Database backend — persist projects, tasks, users
- [ ] Real-time updates so group members see changes live
- [ ] Email invite system — actually send invites to teammates
- [ ] Project detail view — individual project page showing all tasks, members, progress
- [ ] Task assignment — assign specific checklist items to specific people
- [ ] Notification system — alerts when a teammate marks something done or misses a deadline
- [ ] Mobile responsive improvements — currently desktop-first
- [ ] Signup / onboarding flow
- [ ] Privacy & Cookies page content
- [ ] Terms of Service page content

---

## File Reference

| File | Purpose |
|---|---|
| `src/pages/Landing.tsx` | Marketing homepage with hero, features, CTA sections |
| `src/pages/Login.tsx` | Login form with email/password, routes to /projects |
| `src/pages/Projects.tsx` | Paginated list of group projects with Open + Next |
| `src/pages/NewProject.tsx` | Expandable project setup: invite, deadlines, docs, checklist |
| `src/pages/SearchFriends.tsx` | Search and add classmates with live filter |
| `src/components/layout/Header.tsx` | Top nav with active tab, logout button |
| `src/components/layout/Footer.tsx` | Footer with Terms/Privacy/Contact |
| `src/App.tsx` | Route definitions using wouter |
| `src/index.css` | CSS custom properties, theme tokens, Inter font import |
| `README.md` | Project overview, tech stack, design system, flow |
| `WORKING_NOTES.md` | This file — session log, decisions, known issues |
