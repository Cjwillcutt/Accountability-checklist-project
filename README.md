# Responsiboard

A student group project accountability tool built as a high-fidelity SaaS web application prototype. Responsiboard helps college and high school students stay on top of group assignments by making task ownership, deadlines, and progress visible to everyone on the team.

---

## What It Does

Group projects fail because nobody knows who is doing what. Responsiboard solves this by giving every group member a shared workspace where tasks are assigned, deadlines are tracked, and progress is visible without anyone having to ask.

**Core features:**
- Task assignment with visible ownership per member
- Deadline tracking with milestone support
- Real-time progress visibility across the group
- Document uploads for rubrics, outlines, and drafts
- Workload checklists to break tasks into steps
- Notes section for context and availability updates
- Friend/teammate search and invite system

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — marketing, features, CTAs |
| `/login` | Login page — email/password form, routes to Projects on submit |
| `/projects` | Projects dashboard — lists group projects with progress |
| `/new-project` | New project setup — invite friends, deadlines, docs, checklist |
| `/search-friends` | Find and add classmates before creating a project |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Routing | Wouter |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |

No backend — this is a frontend prototype with static/mock data.

---

## Design System

**Color palette:**

| Role | Value |
|---|---|
| Background | Deep navy `hsl(225 50% 8%)` |
| Card surface | Slightly lighter dark `hsl(225 40% 12%)` |
| Primary CTA | Vibrant green `hsl(142 71% 45%)` |
| Accent | Electric blue `hsl(217 91% 60%)` |
| Text | High-contrast white |
| Muted text | Slate gray |

**Design inspiration:** Linear.app, Vercel dashboard — bold, modern, high-contrast SaaS aesthetic.

**Typography:** Inter — black/bold for headings, medium for body, clean hierarchy throughout.

**Components:** Rounded corners (8–12px), soft glow on primary actions, smooth hover states, Framer Motion scroll and entry animations.

---

## Project Structure

```
artifacts/responsiboard/
├── src/
│   ├── pages/
│   │   ├── Landing.tsx         # Marketing landing page
│   │   ├── Login.tsx           # Login form (routes to /projects on submit)
│   │   ├── Projects.tsx        # Paginated project dashboard
│   │   ├── NewProject.tsx      # Project creation with expandable sections
│   │   ├── SearchFriends.tsx   # Find and add classmates
│   │   └── not-found.tsx       # 404 page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Nav with active tab highlighting, logout
│   │   │   └── Footer.tsx      # Footer with Terms/Privacy/Contact
│   │   └── ui/                 # shadcn/ui base components
│   ├── App.tsx                 # Router setup
│   ├── main.tsx                # Entry point
│   └── index.css               # Global theme tokens + Inter font import
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## User Flow

```
Landing page
    ↓ "Log in" or "Get Started"
Login page
    ↓ Submit credentials (any email + password)
Projects dashboard
    ├── "Open" → New Project page (project detail/edit)
    ├── "Next" → Paginate through more projects
    ├── "Create New Project" → New Project page
    └── Nav: "Search Friends" → Search Friends page
                                    ↓ Add teammates
                                Back to Projects
```

---

## Running the App

The app runs automatically via the Replit workflow. No manual setup needed.

To restart the development server:

```bash
# Via the Replit workflow panel, restart: artifacts/responsiboard: web
```

The app runs on the port set by the `PORT` environment variable and is accessible at the root preview path `/`.

---

## Product Background

**Problem:** In group projects, people forget tasks or lose track of who is responsible for what. Members interrupt each other for updates, slowing work and causing stress near deadlines.

**Primary users:** High school and college students working on group assignments.

**North star metric:** Percentage of tasks completed on time by group members.

**Out of scope (intentional):** Chat/messaging, listing what members are NOT responsible for, setting access boundaries.

---

## Design Decisions

- **Option B aesthetic** was selected during the design review phase — bold, dark, high-contrast over lighter "Facebook 2006" style alternatives.
- **Search Friends before Create Project** — usability testing showed users tried to create a project before adding friends. Friends must be added first to invite them to a project.
- **Expandable sections on New Project** — each setup step (invite, deadlines, docs, checklist) expands inline rather than navigating away, keeping context intact.
- **Notes placeholder text** — usability testing flagged confusion about what to write in notes. Example text ("I'll be out of town next week...") guides first-time users.
