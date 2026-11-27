# PASSTRACK Frontend — Handoff

> **Status:** Step 11 complete — 2026-11-25
> **Scope:** frontend-only React + Vite + Tailwind rebuild. No backend.
> **Tracker:** [`PASSTRACK-REBUILD-TRACKER.md`](./PASSTRACK-REBUILD-TRACKER.md)
> **Audit:** [`PASSTRACK-FIGMA-AUDIT.md`](./PASSTRACK-FIGMA-AUDIT.md)
> **Parity notes:** [`PARITY-NOTES.md`](./PARITY-NOTES.md)
> **Portal improvements:** [`PORTAL-IMPROVEMENTS.md`](./PORTAL-IMPROVEMENTS.md)

This is the acceptance and handoff record for the rebuild. It states what works, how the mock behaves, what is deliberately absent, and how to verify the build. The older [`DEEPSEEK-HANDOFF.md`](./DEEPSEEK-HANDOFF.md) is a historical Step 5 snapshot and is not the current handoff.

---

## 1. What this is

A complete member and administrator portal for PASSTRACK, rebuilt as a single-page React application. Every screen in the supplied static prototype has a migrated route, and the admin portal (which had no prototype) is built from the brief.

The application is a **frontend demo**. It looks and behaves like a working product, but all state lives in the browser and every "server-side" event is simulated locally.

---

## 2. Run it

```bash
npm install
npm run dev       # Vite dev server
npm run build     # production build into dist/
npm run preview   # serve the production build
```

Node 24 / npm 11 were used for the verified build (`vite v8.3.8`). The production bundle is a single 517 kB JS file (140 kB gzip); Vite prints a chunk-size warning, which is expected and non-blocking.

### Demo credentials

| Role | Application ID | Password |
|---|---|---|
| Member — Processing | `PS-12345` | `Pw-8Kq27xM` |
| Member — For Delivery | `PS-20001` | `Pw-Maria2026` |
| Member — Rejected | `PS-20002` | `Pw-Juan2026` |
| Admin | any non-empty username | any non-empty password |

The login screen also offers quick-fill buttons and a "Reset demo data" action. `/store-check` exposes the store state and scenario controls for demos.

---

## 3. Routes

| Area | Routes |
|---|---|
| Public | `/`, `/login`, `/terms` |
| Registration | `/register/personal-details`, `/register/id-details`, `/register/application`, `/register/success` |
| Member | `/dashboard`, `/application/status`, `/application/information`, `/profile` |
| Inquiries | `/inquiries`, `/inquiries/new`, `/inquiries/:ticketId` |
| Renewal | `/renewal/eligibility`, `/renewal/personal-details`, `/renewal/documents-appointment`, `/renewal/review`, `/renewal/submitted`, `/renewal/status` |
| Admin | `/admin/login`, `/admin/dashboard`, `/admin/applications`, `/admin/applications/:applicationId`, `/admin/renewals`, `/admin/renewals/:reference`, `/admin/inquiries`, `/admin/inquiries/:ticketId`, `/admin/profile` |
| Demo only | `/styleguide`, `/store-check` |

Member and admin sessions are separate. Logging out of one does not clear the other. Route guards are client-side only.

---

## 4. Implemented mock behavior

### Member

- Login with Application ID + password, inline error, password reveal, help modal, saved-registration recovery, demo quick-fill, reset.
- Three-step registration with per-step validation, draft persistence, ID upload metadata (JPG/PNG/PDF, 10 MB), Terms gate, generated `PS-#####` ID and `Pw-…` temporary password, copy/download, and mock email confirmation.
- Dashboard with four cards: application status, inquiry summary, application information, passport renewal.
- Six-stage application tracker (Submitted → Under Review → Processing → Ready for Release → Approved → For Delivery) with Processing, For Delivery, Rejected, and Delivered variants; progress is derived from canonical status, never hardcoded.
- Dedicated application-information page using the stored application/member record.
- Compact profile from registration data; editable member profile updates the shared record.
- Renewal: passport eligibility derived from the member's stored passport record (not typed input), four steps, document/appointment metadata, review confirmation, generated `RN-YYYY-####`, status page for Pending/Approved/Rejected, duplicate-request and ineligible-route guards.
- Inquiries: grouped summary, search, status/priority filters, new inquiry with attachment metadata and reply-channel options, conversation timeline, reply, copy-to-email, and reopen of resolved tickets.

### Administrator

- Separate sign-in and session; dashboard metrics computed from the seeded records.
- Applications list with search and status filters; detail view with status update and note.
- Renewal queue with status filters; detail view with approve/reject confirmation modal and decision notes.
- Inquiry queue with priority filter; detail view with officer reply, attachment metadata, and status changes.
- Editable admin profile.

### Shared state

- One `localStorage` key: `passtrack.v2`.
- Member and admin portals read and write the same arrays, so an admin status change, renewal decision, or officer reply appears in the member portal on the next read/navigation.
- A `storage` event listener keeps other open tabs in sync without a write loop.
- File uploads store **metadata only** (`name`, `size`, `type`). No blobs, base64, or object URLs are persisted.
- Application status changes append to application history.

---

## 5. What does not exist

This is the explicit boundary between the mock frontend and a real system:

| Not implemented | Consequence in this demo |
|---|---|
| Backend server / API | Every action is a local reducer call |
| Database | Data lives in `localStorage` under `passtrack.v2` |
| Real authentication | Credentials are seeded/plain strings; admin accepts any non-empty input |
| Real session security | Guards are client-side checks only |
| Email / SMS | Confirmation and notification modals are simulated |
| Payment processing | Fees and processing types are display-only |
| File storage | Only upload metadata is kept; files never leave the browser |
| Courier / officer systems | Delivery and review states are seeded or manually changed |
| Server-side validation | Validation exists only in the browser |
| Audit trail / notifications | History is a local array; no external notifications |

Nothing in the UI should be read as evidence that these services exist.

---

## 6. Verification evidence

Step 11 acceptance, run on 2026-11-25:

- `npm run build` succeeds (Vite 8.3.8, 99 modules transformed).
- **96/96** scripted headless-Chrome checks passed against the production preview.
- Coverage: stack and TypeScript check, seed creation, login error/success, dashboard cards, application information, all three application status variants, profile, copy feedback, inquiry summary/search/new/attachment/reply/reopen, renewal eligibility (read-only passport), four-step renewal submit, duplicate block, admin dashboard/search/filter/status update/renewal approval modal/inquiry reply/status/profile save, cross-portal visibility, Terms, full three-step registration, generated-credential login, new-applicant renewal block, responsive overflow at 1440 / 1024 / 768 / 390 px, local assets, sticky header, and zero console errors.
- Earlier Step 10 evidence (168 route/viewport combinations, 44 control checks, a11y sweep, prototype parity) remains valid for unchanged surfaces.

The acceptance script is intentionally kept outside the repository; results and labels are recorded in the tracker and audit doc.

---

## 7. Deployment notes

- The app uses `BrowserRouter`. Static hosting must rewrite unknown paths to `index.html` (SPA fallback), otherwise deep links 404. The Vercel rewrite is committed in `vercel.json`; redeploy after changing it.
- If the host cannot rewrite, switch to `HashRouter` rather than adding per-route HTML files.
- Assets are local under `public/assets/`; no remote image URLs are required.
- `localStorage` is origin-scoped. Moving to a different host or clearing site data resets the demo.

---

## 8. Known limitations

- Figma MCP was unavailable throughout the rebuild. Visual parity was checked against 1440 px captures of the preserved static prototype, not the original Figma file. Re-verify against Figma if access returns.
- Admin screens have no prototype; they were built from the brief and reviewed for internal consistency.
- Four inline sentence links are 17 px tall. WCAG 2.5.8 exempts inline links; padding them would break text flow.
- The single production bundle exceeds Vite's 500 kB warning threshold. Add route-level lazy loading if bundle size becomes a requirement.
- `public/prototype/` was archived to `docs/archive/prototype/` with user approval. It stays in the repository as a reference but is no longer copied into `dist/`.

---

## 9. Prototype archive (resolved)

**Archived with approval:** `public/prototype/` was moved to `docs/archive/prototype/` on 2026-11-25 using `git mv`. It remains available in the repository as the visual baseline and rollback reference, but it is no longer under `public/` and therefore no longer ships in the production build. The brief link and audit references were updated to the archive path.
