# PASSTRACK UI Rebuild — Implementation Tracker

> **Companion brief:** [`public/prototype/passport-ui-rebuild.md`](../public/prototype/passport-ui-rebuild.md)
> **Visual baseline:** the existing static prototype in `public/prototype/` (Figma MCP is not available in this session).
> **Scope:** frontend-only React + Vite + Tailwind rebuild. No backend, database, API, auth server, email/SMS, payment, or file storage.
> **Started:** 2026-11-23
> **Last updated:** 2026-11-24

---

## How to use this file

1. Work the steps in order. Each step has **Tasks**, **Files**, and a **Done when** exit criterion.
2. Update the checkbox and the **Progress at a glance** table as work lands.
3. Add one row to the **Change log** for every meaningful batch of edits.
4. Record any new decision or conflict in the **Decisions log** instead of leaving it implicit.
5. Do not mark a screen complete until it has been checked against the prototype screenshot at 1440 px and passes the route matrix.

### Status legend

| Mark | Meaning |
|---|---|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Done |
| `[!]` | Blocked |
| `[-]` | Intentionally skipped (record why) |

---

## Progress at a glance

| # | Step | Status | Batch | Notes |
|---|---|---|---|---|
| 0 | Baseline decision (static prototype) | `[x]` | 0 | Figma MCP unavailable; prototype is the visual source |
| 1 | Audit + freeze baseline + audit doc | `[~]` | 0.5 | Audit doc created; 1440 px reference screenshots deferred to Step 10 |
| 2 | Scaffold React + Vite + Tailwind | `[x]` | 0.5 | Build verified (`vite v8.3.8`, output in `dist/`) |
| 3 | Shared components + layouts | `[x]` | 1 | UI kit preview at `/styleguide`; build passes |
| 4 | Mock store + seed data + helpers | `[x]` | 1 | `/store-check` verifies sessions, shared status updates, renewal decisions, inquiries, reset |
| 5 | Auth, Terms, registration | `[x]` | 2 | Login, 3-step registration, Terms, success credentials, saved sign-in recovery; interim member dashboard closes the loop |
| 6 | Member dashboard, tracking, profile | `[x]` | 1.5 | Four dashboard cards, six-stage tracker with Processing / For Delivery / Rejected variants, compact profile; one shared progress selector |
| 7 | Renewal flow | `[x]` | 2 | Eligibility → details → documents/appointment → review/submit → reference → status; nested draft matches seeded renewals |
| 8 | Member inquiries | `[x]` | 2 | List with summary/grouped cards, new inquiry with metadata attachments and reply channels, detail thread with reply and reopen |
| 9 | Admin portal | `[x]` | 3 | Separate admin session, dashboard, applications, renewals, inquiries, and editable profile; shared mutations visible in member views |
| 10 | Integration, responsive, parity | `[ ]` | 2 | — |
| 11 | Acceptance + handoff | `[ ]` | 0.5 | — |

**Current position:** Step 10 — integration, responsive, parity.

---

## Locked constraints and decisions

| Topic | Decision |
|---|---|
| Stack | React 19 + Vite + Tailwind CSS v4 (`@tailwindcss/vite`) |
| Language | JavaScript / JSX (no TypeScript migration) |
| Router | `react-router-dom` with `BrowserRouter` (SPA fallback documented) |
| Icons | Port the prototype's inline SVG set into one `Icon` component; no icon library |
| Font | Self-hosted Inter variable font |
| Visual source | Existing static prototype + `public/prototype/css/tokens.css` |
| Figma | Not reachable this session; final pixel parity marked provisional |
| Progress | Derived from canonical status/stage; no hardcoded 50/60 percentages |
| Admin metrics | Computed from seeded records |
| Rejected application | Shown at review stage; later stages marked N/A |
| Inquiry source | Expanded design `304:247`–`304:249`; merge useful older filters/categories |
| Member profile | Compact view of registration data; no invented settings area |
| Prototype files | Preserved read-only until parity; archive only with user approval |
| Backend | None. All "submissions", emails, SMS, and decisions are local mocks |

---

## Baseline audit snapshot

### Existing project

| Item | Finding |
|---|---|
| `package.json` | Missing |
| Build tooling | None — plain HTML/CSS/JS |
| Static pages | 22 HTML files under `public/prototype/` |
| Styles | `css/tokens.css`, `css/app.css`, `css/pages.css` |
| Scripts | `js/store.js`, `js/chrome.js`, `js/ui.js`, `js/renewal.js` |
| Assets | `img/logo-mark.png`, `img/plane.jpeg`, `img/favicon.svg` |
| Git state | Clean except the untracked brief |
| Node / npm | Node `v24.22.0`, npm `11.19.1` |
| Admin portal | Missing entirely |
| Member profile | Header drawer only |
| Mock persistence | `localStorage` key `passtrack.prototype.v1` |

### Existing prototype coverage

| Route target | Prototype file | Fields / capability present |
|---|---|---|
| `/`, `/login` | `login.html` | appId, password, error alert, register link |
| `/register/personal-details` | `register-personal.html` | 10 fields incl. optional middle name |
| `/register/id-details` | `register-id.html` | 9 fields + ID upload |
| `/register/application` | `register.html` | app type, processing type, terms |
| `/terms` | `terms.html` | long-form terms |
| `/register/success` | `success.html` | credentials + copy |
| `/dashboard` | `dashboard.html` | 4 cards |
| `/application/status` | `status.html` | 6-stage tracker |
| `/inquiries` | `inquiries.html` | list + new-inquiry drawer |
| `/inquiries/new` | `inquiries.html?new=1` | category, subject, message |
| `/inquiries/:ticketId` | `inquiry.html` | conversation + reply |
| `/renewal/eligibility` | `renewal-1.html` | passport, expiry, reason, processing |
| `/renewal/personal-details` | `renewal-2.html` | 13 prefilled fields |
| `/renewal/documents-appointment` | `renewal-3.html` | uploads, branch, date |
| `/renewal/review` | `renewal-4.html` | summaries + confirmation |
| `/renewal/submitted` | `renewal-submitted.html` | reference + next links |
| `/renewal/status` | `renewal-status.html` | pending/approved/rejected |
| `/profile` | header drawer only | name, app id, email, type, date |
| All `/admin/*` | **none** | build from brief |

### Reuse / replace / keep

| Action | Items |
|---|---|
| **Reuse** | `tokens.css` values, formatting helpers, validation patterns, seed inquiry messages, Terms copy, status copy, icon SVG paths, demo credentials |
| **Replace** | Multi-page HTML navigation, `chrome.js` DOM injection, query-param demo bar |
| **Keep** | `public/prototype/` as read-only visual reference until parity |

### Prototype demo credentials

| Role | Credentials |
|---|---|
| Member — Processing | `PS-12345` / `Pw-8Kq27xM` |
| Member — For Delivery | `PS-20001` / `Pw-Maria2026` |
| Member — Rejected | `PS-20002` / `Pw-Juan2026` |
| Member (generated) | any credentials created by completing registration |
| Admin | any non-empty username + password (seeded profile: `admin`) |

### Credential handling

- Registration creates one member record and one application record in the same store transaction.
- The generated `PS-#####` ID and temporary password are stored on the member record in `passtrack.v2` (`localStorage`), so they keep working after refresh and logout.
- The most recent registration is also kept as `lastRegistration`; the login screen shows a **saved sign-in details** panel with reveal/copy/use actions, so credentials are recoverable if the confirmation screen was closed.
- Download creates a local `.txt` file. The email action is a clearly labeled mock and never sends a message.
- Resetting demo data removes accounts created in the browser and restores the seeded accounts above.

---

## Target architecture

```
PassTrack-UI-UX/
├─ package.json
├─ vite.config.js
├─ index.html
├─ public/
│  ├─ assets/                 # logo-mark.png, plane.jpeg, favicon.svg
│  └─ prototype/              # read-only reference until parity
├─ docs/
│  ├─ PASSTRACK-REBUILD-TRACKER.md
│  └─ PASSTRACK-FIGMA-AUDIT.md
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ styles/
   │  ├─ tokens.css
   │  └─ index.css
   ├─ data/
   │  ├─ seed.js
   │  ├─ StoreProvider.jsx
   │  └─ storage.js
   ├─ lib/
   │  ├─ constants.js
   │  ├─ format.js
   │  ├─ validation.js
   │  ├─ files.js
   │  └─ ids.js
   ├─ components/
   │  ├─ layout/              # AppHeader, Footer, MemberLayout,
   │  │                       # AdminLayout, AdminSidebar, ProtectedRoute,
   │  │                       # ScrollToTop, NotFound
   │  ├─ ui/                  # Button, FormField, SelectField,
   │  │                       # FileUploadField, StatusBadge, CopyButton,
   │  │                       # Modal, Toast, Stepper, SummaryCard,
   │  │                       # DataTable, FilterBar, EmptyState, Icon
   │  ├─ application/         # ApplicationTimeline, StageProgress
   │  ├─ inquiries/           # InquiryCard, MessageTimeline, InquiryReplyForm
   │  └─ renewal/             # RenewalDecisionPanel, RequirementRail
   └─ pages/
      ├─ auth/                # Login, RegisterPersonal, RegisterId,
      │                       # RegisterApplication, Terms, RegisterSuccess
      ├─ member/              # Dashboard, ApplicationStatus, Inquiries,
      │                       # NewInquiry, InquiryDetail, Profile
      ├─ renewal/             # Eligibility, PersonalDetails,
      │                       # DocumentsAppointment, Review, Submitted, Status
      └─ admin/               # Login, Dashboard, Applications,
                              # ApplicationDetail, Renewals, RenewalDetail,
                              # Inquiries, InquiryDetail, Profile
```

---

## Shared data model

Single store, single reducer, single key: `passtrack.v2`.

```js
{
  version: 2,
  memberSession: { appId } | null,
  adminSession: { username } | null,
  members: [{ id, appId, password, personal, idDetails }],
  applications: [{
    id, memberId, applicantName, email, passportType, processingType,
    status, submittedAt, updatedAt, rejectionReason, stages
  }],
  inquiries: [{
    id, applicationId, memberId, subject, category, priority, status,
    attachments, messages, createdAt, updatedAt
  }],
  renewals: [{
    ref, applicationId, memberId, status, draft, documents,
    appointment, notes, submittedAt, decisionAt
  }],
  adminProfile: { name, email, dob, address },
  registrationDraft: {},
  renewalDraft: {}
}
```

### Canonical application statuses

| Canonical | Label | Stage | Portal use |
|---|---|---:|---|
| `SUBMITTED` | Submitted | 1 | timeline |
| `UNDER_REVIEW` | Under Review | 2 | timeline |
| `PROCESSING` | Processing | 3 | dashboard / timeline |
| `READY_FOR_RELEASE` | Ready for Release | 4 | timeline |
| `APPROVED` | Approved | 5 | timeline |
| `FOR_DELIVERY` | For Delivery | 6 | dashboard / timeline |
| `DELIVERED` | Delivered | complete | timeline |
| `REJECTED` | Rejected | review | timeline + guidance |

Other status sets:

- **Renewal:** `PENDING`, `APPROVED`, `REJECTED`
- **Inquiry:** `OPEN`, `AWAITING`, `RESOLVED`
- **Priority:** `LOW`, `MEDIUM`, `HIGH`

Persistence rules:

- Store file **metadata only** (`name`, `size`, `type`), never blobs.
- Object URLs live in memory and are revoked on unmount.
- Seed only when the key is absent; never duplicate records on render.

---

## Step-by-step checklist

### Step 0 — Baseline decision

- [x] Figma MCP confirmed unavailable; existing static prototype chosen as visual baseline.
- [x] Recorded that final pixel parity vs. Figma remains provisional.
- [x] Locked stack, router, assets, and data-model decisions.

**Files:** none
**Done when:** baseline and constraints are recorded. ✅

---

### Step 1 — Audit and freeze baseline

- [x] Inventory every prototype page, field, button, and flow.
- [x] Capture/record baseline layout facts from `tokens.css` and page CSS.
- [ ] Capture 1440 px reference screenshots of each prototype page. *(deferred to Step 10 parity pass)*
- [x] Write `docs/PASSTRACK-FIGMA-AUDIT.md` with screen inventory, node IDs, route map, conflicts, assets, decisions.
- [x] List known conflicts: older vs expanded inquiries, missing member profile, progress percentages, admin designs absent.
- [x] Record what to reuse, replace, and keep.

**Files:** `docs/PASSTRACK-FIGMA-AUDIT.md`
**Done when:** every route has a source, owner step, and known design gaps. *(screenshots remain in Step 10)*

---

### Step 2 — Scaffold React + Vite + Tailwind

- [x] Add Vite React JS scaffold at repo root without deleting `public/prototype/`.
- [x] Install `react-router-dom`, `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/inter`.
- [x] Configure Tailwind v4 theme with prototype tokens (colors, header gradient, radii, shadows, type).
- [x] Copy brand assets to `public/assets/`; wire favicon.
- [x] Create `src/main.jsx`, `src/App.jsx` route skeleton, global CSS.
- [x] Add placeholder pages for every route. *(temporary `*` boot screen until pages land)*
- [x] Verify `npm run dev` and `npm run build`.

**Files:** `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/styles/*`
**Done when:** app boots at `/`, tokens resolve, build succeeds, and `/prototype/...` still opens.

---

### Step 3 — Shared components and layouts

- [x] `AppHeader` (auth / member / admin variants) with gradient, logo, airplane, label, actions.
- [x] `Footer`, `MemberLayout`, `AdminLayout`, `AdminSidebar`, mobile nav.
- [x] `ProtectedRoute` (member/admin), `ScrollToTop`, `NotFound`.
- [x] Form kit: `FormField`, `SelectField`, `TextareaField`, `FileUploadField`, `Checkbox` with accessible errors.
- [x] `Button`, `StatusBadge`, `CopyButton`, `Modal`, `Toast`, `Stepper`, `SummaryCard`, `DataTable`, `FilterBar`, `EmptyState`, `Icon`.
- [x] Validate the kit by assembling Login + a dashboard shell with no page-specific CSS. *(validated via `/styleguide`; login lands in Step 5)*

**Files:** `src/components/**`
**Done when:** both shells render responsively and shared controls behave consistently.

---

### Step 4 — Mock store and seed data

- [x] Port `store.js` into `seed.js` + context/reducer with `localStorage` persistence.
- [x] Seed: Processing, For Delivery, and Rejected applications; mixed inquiries; pending renewal; admin profile.
- [x] Actions: register, member/admin login/logout, add inquiry, reply, submit renewal, decide renewal, set application status, update profile, reset demo.
- [x] Selectors shared by member dashboard/status and admin tables.
- [x] Helpers: IDs (`PS-#####`, `RN-YYYY-####`, `INQ-###`), dates, validation, file checks, copy/download, toast.
- [x] Verify an admin mutation and member-facing result through the store. *(via `/store-check`)*

**Files:** `src/data/**`, `src/lib/**`
**Done when:** every screen can read/write one source of truth.

---

### Step 5 — Auth, Terms, registration

- [x] `/` and `/login` — full match, error state, “If Login Error?” modal, register link, demo credentials.
- [x] `/register/personal-details` — all fields, `+63`, date/email validation, draft persistence.
- [x] `/register/id-details` — all fields, ID upload JPG/PNG/PDF ≤ 10 MB, filename/size/remove/replace, errors.
- [x] `/register/application` — app type, Regular/Express, required terms acceptance, disabled submit, back/login.
- [x] `/terms` — 11 sections + TOC + accept/decline.
- [x] `/register/success` — generated ID/password, copy, save reminder, mock download/email, go to login.
- [x] Submit creates exactly one member + application; generated credentials work.

**Files:** `src/pages/auth/**`, `src/components/layout/AuthShell.jsx`, `src/pages/member/Dashboard.jsx` *(interim target)*, `src/lib/usePageTitle.js`
**Done when:** register → logout → login with generated credentials → dashboard succeeds. *(interim dashboard; full Step 6 screens pending)*

---

### Step 6 — Member dashboard, tracking, profile

- [x] `/dashboard` — four Figma cards, header Application ID + copy, Profile/Logout.
- [x] `/application/status` — two-phase six-stage tracker, Processing / For Delivery / Rejected variants, explanation, next step, estimate, last-updated, View Inquiry.
- [x] `/profile` — compact view from registration data.
- [x] Progress/status derived from one selector.

**Files:** `src/pages/member/**`, `src/components/application/**`, `src/lib/applicationProgress.js`
**Done when:** a status change updates dashboard and timeline consistently. *(both read `getApplicationProgress` + the shared store record)*

---

### Step 7 — Renewal flow

- [x] `/renewal/eligibility` — passport number, expiry, reason, processing cards (₱950 / ₱1,200), six-month and lost/damaged callout.
- [x] `/renewal/personal-details` — prefilled, editable, draft preserved on Back/Next.
- [x] `/renewal/documents-appointment` — required + optional uploads, branch/date/time, 15-minute reminder.
- [x] `/renewal/review` — summaries, confirmation checkbox, Back/Submit.
- [x] `/renewal/submitted` — `RN-YYYY-####`, pending message, links.
- [x] `/renewal/status` — Pending / Approved / Rejected from shared record with notes and appointment guidance.

**Files:** `src/pages/renewal/**`, `src/components/renewal/**`
**Done when:** renewal survives Back/Next, submits once, and reflects an admin decision without extra state. *(seeded Approved / Rejected renewals exercise the decision states; the admin decision write lands in Step 9)*

---

### Step 8 — Member inquiries

- [x] `/inquiries` — summary cards, grouped cards, search, status/priority filters, Start New Inquiry.
- [x] `/inquiries/new` — application context, deduplicated categories, required subject/message, multi-attachment metadata, reply channels, guidance; creates ticket and routes to detail.
- [x] `/inquiries/:ticketId` — metadata, timeline, attachments, reply, optional copy-to-email, resolved→reopen.
- [x] Verify new ticket appears in list and replies update timestamp/status everywhere.

**Files:** `src/pages/member/Inquiries*`, `src/components/inquiries/**`
**Done when:** create → detail → reply → reopen works end to end. *(seeded Open / Awaiting / Resolved tickets cover the list states; the admin reply side lands in Step 9)*

---

### Step 9 — Admin portal

- [x] `/admin/login` — separate session, documented demo rule.
- [x] `/admin/dashboard` — sidebar shell, computed metrics, applications overview + search.
- [x] `/admin/applications` — search, status filter, table.
- [x] `/admin/applications/:applicationId` — applicant details, status update, shared write.
- [x] `/admin/renewals` — tabs/counts, search, table.
- [x] `/admin/renewals/:reference` — details, notes, approve/reject with confirmation; rejection requires note.
- [x] `/admin/inquiries` + detail — search/filter, conversation, reply.
- [x] `/admin/profile` — editable local profile, save, back, logout.

**Files:** `src/pages/admin/**`, `src/components/layout/AdminLayout.jsx`
**Done when:** every admin mutation is visible in the member portal after navigation/refresh. *(verified by shared store wiring; browser route smoke test passes)*

---

### Step 10 — Integration, responsive, parity

- [ ] Every control works: links, copy, download, upload, filters, search, modals, tabs, submits.
- [ ] Accessibility: labels, `aria-invalid`/`aria-describedby`, focus rings, modal focus trap, table semantics, keyboard nav.
- [ ] Responsive at 1440 / 1280 / 1024 / 768 / 390; no horizontal overflow.
- [ ] Side-by-side comparison vs. prototype screenshots; fix geometry, header, type, cards, forms, badges.
- [ ] Clearly labeled demo controls for reset and scenario switching.
- [ ] `npm run build` passes; primary flows manually tested.

**Files:** cross-cutting
**Done when:** acceptance checklist passes.

---

### Step 11 — Acceptance and handoff

- [ ] Walk the 13-point acceptance checklist in the brief.
- [ ] Update `docs/PASSTRACK-FIGMA-AUDIT.md` completion status.
- [ ] Summarize mock frontend behavior vs. absent backend.
- [ ] Archive `public/prototype/` only with user approval.

---

## Route coverage matrix

Update the **Status** column as each route is migrated.

| Route | Page | Prototype source | Status |
|---|---|---|---|
| `/`, `/login` | Member Login | `login.html` | Migrated |
| `/register/personal-details` | Registration step 1 | `register-personal.html` | Migrated |
| `/register/id-details` | Registration step 2 | `register-id.html` | Migrated |
| `/register/application` | Registration step 3 | `register.html` | Migrated |
| `/terms` | Terms and Conditions | `terms.html` | Migrated |
| `/register/success` | Application received | `success.html` | Migrated |
| `/dashboard` | Member dashboard | `dashboard.html` | Migrated |
| `/application/status` | Application tracking | `status.html` | Migrated |
| `/inquiries` | Inquiry overview | `inquiries.html` | Migrated |
| `/inquiries/new` | New inquiry | `inquiries.html?new=1` | Migrated (full page instead of drawer) |
| `/inquiries/:ticketId` | Inquiry detail | `inquiry.html` | Migrated |
| `/renewal/eligibility` | Renewal step 1 | `renewal-1.html` | Migrated |
| `/renewal/personal-details` | Renewal step 2 | `renewal-2.html` | Migrated |
| `/renewal/documents-appointment` | Renewal step 3 | `renewal-3.html` | Migrated |
| `/renewal/review` | Renewal step 4 | `renewal-4.html` | Migrated |
| `/renewal/submitted` | Renewal confirmation | `renewal-submitted.html` | Migrated |
| `/renewal/status` | Renewal status | `renewal-status.html` | Migrated |
| `/profile` | Member profile | Header drawer only | Migrated |
| `/admin/login` | Admin login | None | Migrated |
| `/admin/dashboard` | Admin dashboard | None | Migrated |
| `/admin/applications` | Applications list | None | Migrated |
| `/admin/applications/:applicationId` | Application detail | None | Migrated |
| `/admin/renewals` | Renewal queue | None | Migrated |
| `/admin/renewals/:reference` | Renewal detail | None | Migrated |
| `/admin/inquiries` | Admin inquiries | None | Migrated |
| `/admin/inquiries/:ticketId` | Admin inquiry detail | None | Migrated |
| `/admin/profile` | Admin profile | None | Migrated |

---

## Decisions log

| Date | Decision | Reason |
|---|---|---|
| 2026-11-23 | Use static prototype as visual baseline | Figma MCP unavailable in session |
| 2026-11-23 | Tailwind v4 + `@tailwindcss/vite` | Current integration; Node 24 / npm 11 compatible |
| 2026-11-23 | `BrowserRouter` with SPA fallback | Clean URLs; Vite dev/preview support |
| 2026-11-23 | Port inline SVG icons, no icon library | Economical; matches existing visuals |
| 2026-11-23 | Derive progress from status, not hardcoded percentages | Avoids contradictory Figma sample values |
| 2026-11-23 | Compute admin metrics from seed records | Keeps demo internally consistent |
| 2026-11-23 | Preserve `public/prototype/` until parity | Safe reference; no destructive migration |
| 2026-11-24 | Renewal draft uses the seeded nested shape (`personal`, `documents`, `appointment`) | Keeps member status and the Step 9 admin queue reading one record shape |
| 2026-11-24 | Admin screens use shared design tokens and primitives because no admin prototype screens exist | Keeps the portal visually consistent while preserving separate admin/member sessions |

---

## Known issues / follow-ups

| # | Item | Impact | Resolution |
|---|---|---|---|
| 1 | Figma MCP unavailable | Pixel parity provisional | Re-verify if MCP/screenshots become available |
| 2 | Admin designs absent from prototype | Highest visual risk | Build from brief descriptions + node IDs; review together |
| 3 | Older vs expanded inquiry designs conflict | Category/filter ambiguity | Use `304:247`–`304:249`; merge older filters |
| 4 | No member profile design | Could be over-built | Compact view from registration data only |
| 5 | `BrowserRouter` needs static fallback | Broken deep links on plain static hosting | Document rewrite or switch to `HashRouter` if needed |
| 6 | Prototype uses one seeded app for all states | Demo cannot show all statuses at once | Seed separate applications for Processing / For Delivery / Rejected |
| 7 | Steps 6–7 CTAs target routes delivered later | `/inquiries` and `/inquiries/new` showed `NotFound` before Step 8 | Resolved in Step 8 |

---

## Change log

| Date | Step | Summary | Files |
|---|---|---|---|
| 2026-11-23 | 0 | Created tracker; locked baseline and technical decisions | `docs/PASSTRACK-REBUILD-TRACKER.md` |
| 2026-11-23 | 1 | Wrote audit reference: screen inventory, node IDs, route map, conflicts, tokens, scope | `docs/PASSTRACK-FIGMA-AUDIT.md` |
| 2026-11-23 | 2 | Scaffolded Vite + React + Tailwind v4; ported tokens; copied brand assets; added boot screen | `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/styles/index.css`, `public/assets/*`, `.gitignore` |
| 2026-11-23 | 3 | Built shared UI kit, member/admin shells, guards, modal/toast, and `/styleguide` preview; build passes | `src/components/**`, `src/lib/cn.js`, `src/lib/files.js`, `src/lib/constants.js`, `src/pages/dev/StyleGuide.jsx`, `src/App.jsx`, `src/styles/index.css` |
| 2026-11-24 | 4 | Added seeded mock store, selectors, ID/date/validation/download helpers, store actions, and `/store-check` verification page; build passes | `src/data/**`, `src/lib/ids.js`, `src/lib/format.js`, `src/lib/validation.js`, `src/lib/download.js`, `src/pages/dev/StoreCheck.jsx`, `src/App.jsx` |
| 2026-11-24 | 5 | Added login with error/help states, 3-step registration, Terms, success credentials with saved recovery, route integration, and an interim dashboard target; build passes | `src/pages/auth/**`, `src/pages/member/Dashboard.jsx`, `src/components/layout/AuthShell.jsx`, `src/components/layout/MemberLayout.jsx`, `src/components/ui/Field.jsx`, `src/components/ui/Icon.jsx`, `src/components/layout/Footer.jsx`, `src/lib/usePageTitle.js`, `src/App.jsx` |
| 2026-11-24 | Handoff | Added `docs/DEEPSEEK-HANDOFF.md` to preserve the stopped-session state, implementation inventory, known gaps, and next verification actions | `docs/DEEPSEEK-HANDOFF.md` |
| 2026-11-24 | 6 | Rebuilt the member dashboard as four prototype cards; added the six-stage application tracker, compact profile, shared progress selector, native progress bar, and guarded routes; build passes | `src/pages/member/Dashboard.jsx`, `src/pages/member/ApplicationStatus.jsx`, `src/pages/member/Profile.jsx`, `src/components/application/**`, `src/lib/applicationProgress.js`, `src/components/application/StageProgress.jsx`, `src/components/layout/MemberLayout.jsx`, `src/styles/index.css`, `src/App.jsx` |
| 2026-11-24 | 7 | Added the six renewal routes with a shared shell and requirement rail, prefilled details, document/appointment uploads, review confirmation, reference screen, and decision-aware status page; build passes | `src/pages/renewal/**`, `src/components/renewal/**`, `src/pages/member/Dashboard.jsx`, `src/App.jsx` |
| 2026-11-24 | 8 | Added the inquiry list (summary + status groups, search, status/priority filters), full-page new inquiry form with attachment metadata and reply channels, and ticket detail with conversation, reply composer, copy-to-email, and reopen; build passes | `src/pages/member/Inquiries.jsx`, `src/pages/member/NewInquiry.jsx`, `src/pages/member/InquiryDetail.jsx`, `src/components/inquiries/**`, `src/App.jsx` |
| 2026-11-24 | 9 | Added the separate admin session, responsive admin shell, dashboard metrics, application status management, renewal decisions with confirmation, inquiry replies/status updates, and editable admin profile; build passes and all admin routes smoke-tested | `src/pages/admin/**`, `src/components/layout/AdminLayout.jsx`, `src/data/StoreProvider.jsx`, `src/App.jsx` |

---

## Acceptance checklist (from brief §10)

- [ ] App uses React + Vite + Tailwind with JavaScript/JSX.
- [ ] Previous plain HTML/CSS/JS experience migrated without losing behavior.
- [ ] Member login, all 3 registration steps, Terms, and success credentials work.
- [ ] Dashboard and tracking match Processing, For Delivery, and Rejected states.
- [ ] Renewal all 4 steps, confirmation, and Pending/Approved/Rejected work.
- [ ] Member inquiries list, filters, new inquiry, attachments, timeline, reply, reopen work.
- [ ] Admin login, dashboard, applications, renewals, inquiries, and profile work.
- [ ] Admin changes appear in member status pages via shared mock state.
- [ ] Logo/airplane assets are local; no temporary Figma URLs.
- [ ] Desktop screens closely match prototype/Figma; smaller viewports responsive.
- [ ] No inert visible controls, no console-breaking errors, production build succeeds.
- [ ] Final summary distinguishes mock frontend from absent backend.
