# Anurag OS — Development Phases

This document breaks implementation into ordered phases: **MVP first**, then incremental capability. The system is **single-admin** (one account), **public read-only**, with **admin access at `/admin`**. Phases avoid multi-user complexity and unnecessary abstraction.

---

## Phase 1 — Foundation, Auth, and Visibility Model

### Goals

- Establish a clear boundary between **public (read-only)** and **admin (full write)**.
- Ship **secure, single-admin authentication** with no public signup.
- Define the `**isPublic` / visibility** rule once and reuse for all content types.
- Lay a **maintainable** structure that can grow (notes, progress, tasks, interviews) without rework.

### Features to build

- Application skeleton with separate **public** and **admin** areas; admin entry at `**/admin`**.
- **Single admin login** (session or equivalent); logout.
- **Authorization**: all create/update/delete operations allowed only for authenticated admin; public routes never expose write actions.
- **Data persistence** with a consistent visibility field pattern (`isPublic` or equivalent) for every content entity.
- Minimal **admin shell** (dashboard layout placeholder) and **public shell** (layout, navigation) reflecting UI/UX separation (no edit controls on public pages).

### Deliverables

- Working **login at `/admin`** and **protected admin routes**.
- **Public site** reachable without login; **no** login or signup for visitors.
- Documented or implemented **visibility rule**: only `isPublic === true` (or equivalent) surfaces on public pages.
- **Foundation** ready for Phase 2 content features (no multi-user or role matrix).

---

## Phase 2 — MVP Public Portfolio (About + Projects)

### Goals

- Deliver **recruiter-facing value early**: a credible, professional **public portfolio**.
- Prove end-to-end flow: **admin creates content → public sees only public items**.
- Keep scope small: **About** and **Projects** before heavier systems (notes, trackers).

### Features to build

- **Public**: About section; Projects list/detail (read-only).
- **Admin**: Create, edit, delete **projects**; mark each project **public or private**.
- **Public filtering**: only public projects (and public About content if modeled as content) appear on the portfolio.
- **Navigation**: simple navbar; clear section separation per UI/UX requirements.

### Deliverables

- Live **public portfolio** with About + Projects.
- **Admin** can manage projects and visibility without touching code.
- **Responsive** baseline aligned with UI/UX (usable on common viewport sizes).

---

## Phase 3 — Notes System

### Goals

- Implement the **core learning surface**: structured **notes** with categories and optional tags.
- Support **rich text or markdown** as specified, without over-building a custom editor on day one (prefer proven patterns).
- Enforce **public vs private** notes on public routes.

### Features to build

- **Admin**: full CRUD for notes; **categories** (e.g. DSA, System Design, Backend, Others); **tagging**; **public/private** toggle.
- **Public**: list and detail views for **public notes only**; no edit affordances.
- Optional: search/filter **within admin** first; defer global public search to a later iteration unless already trivial.

### Deliverables

- **Notes** manageable from admin; **public notes** readable on the portfolio.
- Categories and tags usable and persisted.
- Visibility rules consistent with Phase 1.

---

## Phase 4 — Progress Tracker

### Goals

- Enable **topic-level preparation tracking** (DSA, System Design, Backend) with clear statuses.
- Keep the model **flat and understandable**—no org-wide or multi-user analytics.

### Features to build

- **Topics** (or items) per category with status: **Not Started**, **In Progress**, **Completed**, **Needs Revision**.
- **Optional confidence level** and **last updated** timestamp per topic.
- **Admin UI** to add, edit, and update progress; data persisted reliably.

### Deliverables

- **Progress tracker** fully usable in admin.
- **Public**: include progress only if product decision is to expose it—**optional, admin-controlled** “insights” can be a thin slice (e.g. summary block) or deferred to Phase 6; if deferred, tracker remains **admin-only** until then.

---

## Phase 5 — Tasks and Interview Tracker

### Goals

- Complete **operational** workflows: daily **tasks** and **interview** documentation.
- Maintain **single visibility model**: interviews (and any task summaries if shown publicly) respect **public/private**.

### Features to build

- **Tasks**: add, complete/incomplete, delete; optional **priority** and **due date**.
- **Interviews**: company, role, date, outcome; **detailed experience** notes; **public/private** flag.
- **Public**: interview experiences visible only when marked public; no write access.

### Deliverables

- **Todo system** and **interview tracker** working in admin.
- **Public** shows only public interview content; tasks typically **admin-only** unless explicitly surfaced later.

---

## Phase 6 — Admin Analytics, Polish, and Non-Functional Requirements

### Goals

- Meet **PRD “basic analytics”** in the simplest useful form (e.g. counts, recent activity, or lightweight metrics—avoid a full BI stack).
- Satisfy **non-functional** expectations: **fast public loads**, **secure** admin operations, **responsive** UI, **smooth** transitions between modes.
- Prepare for **future** items (search, AI, deeper analytics) without implementing them prematurely.

### Features to build

- **Basic admin analytics** (minimal dashboard widgets: e.g. content counts, recent edits, or similar—scoped to single admin).
- **Performance**: target **under ~2 seconds** perceived load for public pages; optimize rendering bottlenecks that matter in practice.
- **UX polish**: smooth transitions public ↔ admin; consistent minimal, professional styling.
- **Reliability**: backups or export strategy if not already present—enough that **data loss** risk is consciously mitigated.

### Deliverables

- **Analytics** slice live in admin (basic, not over-engineered).
- **Public pages** feel fast; **admin** actions stay low-friction (minimal clicks for common tasks).
- **Codebase** remains **modular** and easy to extend (e.g. future search, AI) without redesign.

---

## Phase ordering summary


| Phase | Focus                     | Outcome                                     |
| ----- | ------------------------- | ------------------------------------------- |
| 1     | Auth, visibility, shells  | Safe single-admin + public read-only base   |
| 2     | About + Projects          | MVP portfolio                               |
| 3     | Notes                     | Learning content + public notes             |
| 4     | Progress tracker          | Preparation tracking                        |
| 5     | Tasks + interviews        | Daily ops + interview history               |
| 6     | Analytics + NFRs + polish | Production-quality feel and maintainability |


---

## Principles (applied across all phases)

- **MVP first**: Phases 1–2 deliver something shippable and useful before all subsystems exist.
- **Incremental value**: Each phase adds user-visible or admin-visible capability without big-bang releases.
- **No multi-user**: One admin; no teams, roles beyond admin vs public, or collaboration features unless requirements change.
- **Simple scalability**: Clear modules and persistence so backend/AI features can attach later without rewriting core flows.
- **Avoid over-engineering**: Prefer straightforward CRUD, one visibility flag pattern, and minimal analytics until usage demands more.

