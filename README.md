# PASSTRACK

A frontend rebuild of the PASSTRACK passport application and tracking portal: member registration, application tracking, passport renewal, support inquiries, and a separate administrator portal.

> **This is a frontend demo.** All data, authentication, submissions, notifications, and decisions are simulated in the browser. There is no backend, database, email/SMS service, payment processor, or file storage.

---

## Features

### Member portal
- Sign in with an Application ID and password, with validation and saved-credential recovery
- Three-step passport registration: personal details, ID details, application + Terms
- Generated application ID and temporary password with copy/download
- Dashboard with application status, inquiry summary, application information, and renewal cards
- Six-stage application tracker with Processing, For Delivery, Rejected, and Delivered states
- Dedicated application information page and compact member profile
- Four-step passport renewal with eligibility checks, document/appointment metadata, review, reference number, and Pending/Approved/Rejected status
- Support inquiries: summary, search, status/priority filters, attachments, conversation timeline, replies, and reopen

### Administrator portal
- Separate admin session and responsive admin shell
- Dashboard metrics computed from stored records
- Applications list/detail with status updates
- Renewal queue/detail with approve/reject decisions
- Inquiry queue/detail with officer replies and status changes
- Editable admin profile

### Shared behavior
- Member and admin portals read the same local mock store, so admin changes appear in member views
- Cross-tab synchronization via the browser `storage` event
- File uploads store metadata only (`name`, `size`, `type`) — never file contents
- Responsive layouts at desktop, tablet, and mobile widths

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Routing | React Router 7 (`BrowserRouter`) |
| Font | Self-hosted Inter variable font |
| Icons | Ported inline SVG set |
| Language | JavaScript / JSX |
| Persistence | `localStorage` (mock only) |

---

## Getting started

**Requirements:** Node.js 20+ (built and verified with Node 24 / npm 11).

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

### Demo credentials

| Role | Application ID | Password |
|---|---|---|
| Member — Processing | `PS-12345` | `Pw-8Kq27xM` |
| Member — For Delivery | `PS-20001` | `Pw-Maria2026` |
| Member — Rejected | `PS-20002` | `Pw-Juan2026` |
| Member — New applicant (no passport yet) | `PS-20008` | `Pw-Nina2026` |
| Admin | any non-empty username | any non-empty password |

The login screen has quick-fill buttons for the seeded demo accounts. The `/store-check` route exposes the mock store for demos.

---

## Routes

| Area | Routes |
|---|---|
| Public | `/`, `/login`, `/terms` |
| Registration | `/register/personal-details`, `/register/id-details`, `/register/application`, `/register/success` |
| Member | `/dashboard`, `/application/status`, `/application/information`, `/profile` |
| Inquiries | `/inquiries`, `/inquiries/new`, `/inquiries/:ticketId` |
| Renewal | `/renewal/eligibility`, `/renewal/personal-details`, `/renewal/documents-appointment`, `/renewal/review`, `/renewal/submitted`, `/renewal/status` |
| Admin | `/admin/login`, `/admin/dashboard`, `/admin/applications`, `/admin/applications/:applicationId`, `/admin/renewals`, `/admin/renewals/:reference`, `/admin/inquiries`, `/admin/inquiries/:ticketId`, `/admin/profile` |
| Development | `/styleguide`, `/store-check` |

Member and admin sessions are independent. Route guards are client-side only.

---

## Project structure

```text
.
├── docs/                      # Rebuild tracker, audit, handoff, parity notes
│   └── archive/prototype/     # Original static prototype (reference only)
├── public/
│   └── assets/                # Local logo, favicon, airplane artwork
├── src/
│   ├── components/
│   │   ├── application/       # Tracker and progress components
│   │   ├── inquiries/         # Inquiry list/thread primitives
│   │   ├── layout/            # Member/admin/auth shells, header, footer
│   │   ├── renewal/           # Renewal shell, eligibility notice, guard
│   │   └── ui/                # Buttons, fields, modal, toast, badges, icons
│   ├── data/                  # Mock store provider, seed data, storage
│   ├── lib/                   # Formatting, validation, IDs, eligibility, progress
│   ├── pages/
│   │   ├── admin/             # Administrator portal
│   │   ├── auth/              # Login, registration, Terms, success
│   │   ├── dev/               # Style guide and store inspector
│   │   ├── member/            # Dashboard, tracking, profile, inquiries
│   │   └── renewal/           # Renewal flow
│   ├── styles/                # Tailwind entry and design tokens
│   ├── App.jsx                # Routes and role guards
│   └── main.jsx               # App bootstrap
├── index.html
├── vite.config.js
└── package.json
```

---

## Mock data and persistence

- The entire mock state is stored in one `localStorage` key: `passtrack.v3`.
- Seed data includes four member accounts, nine applications covering every canonical status, eight inquiries, and three renewal requests.
- Member and admin sessions are stored separately in the same record.
- Application status changes append history entries.
- Clearing site data restores the seed state.

---

## What is not implemented

| Missing | Consequence |
|---|---|
| Backend server / API | All actions are local reducer calls |
| Database | Data lives in `localStorage` only |
| Real authentication | Credentials are seeded strings; admin accepts any input |
| Email / SMS | Confirmation and notification dialogs are simulated |
| Payments | Fees and processing types are display-only |
| File storage | Only upload metadata is retained |
| Courier / officer systems | States are seeded or changed manually |
| Server-side validation | Validation runs in the browser only |

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/HANDOFF.md`](docs/HANDOFF.md) | Current handoff: behavior, mock-vs-backend boundary, verification |
| [`docs/PASSTRACK-REBUILD-TRACKER.md`](docs/PASSTRACK-REBUILD-TRACKER.md) | Step-by-step progress, decisions, acceptance checklist |
| [`docs/PASSTRACK-FIGMA-AUDIT.md`](docs/PASSTRACK-FIGMA-AUDIT.md) | Screen inventory, routes, tokens, completion status |
| [`docs/PARITY-NOTES.md`](docs/PARITY-NOTES.md) | Prototype comparison notes |
| [`docs/PORTAL-IMPROVEMENTS.md`](docs/PORTAL-IMPROVEMENTS.md) | Post-build portal improvement batch |
| [`docs/archive/prototype/`](docs/archive/prototype/) | Original static prototype, kept as a visual reference |

---

## Deployment

The app is deployed on **Vercel**. Vercel builds the Vite app with `npm run build` and serves the `dist/` output. SPA deep-link fallback is configured in `vercel.json`, which rewrites unknown paths to `index.html` so `BrowserRouter` routes work on refresh and direct links.

The production build is a single bundle of roughly 517 kB (140 kB gzip), which triggers Vite's chunk-size warning. This has no runtime impact; add route-level lazy loading if bundle size becomes a requirement.
