# PASSTRACK — Figma / Prototype Audit

> Compact project reference for the rebuild. Update this file as screens are completed.
> **Tracking:** [`PASSTRACK-REBUILD-TRACKER.md`](./PASSTRACK-REBUILD-TRACKER.md)
> **Brief:** [`docs/archive/prototype/passport-ui-rebuild.md`](./archive/prototype/passport-ui-rebuild.md)

**Audit date:** 2026-11-23
**Completion status:** Step 11 accepted 2026-11-25 — see §10 for per-area status.
**Visual baseline:** archived static prototype in `docs/archive/prototype/`
**Figma access:** `get_design_context`, `get_metadata`, and `get_screenshot` were **not available** in this session. Figma node IDs below come from the brief. Visual decisions are based on the prototype and its Figma-derived tokens; pixel parity vs. Figma remains provisional.

---

## 1. Screen inventory and Figma references

### Member UI (page `0:1`)

| Screen | Figma node | Prototype source | Rebuild route |
|---|---|---|---|
| Member login (“Homepage” frame) | `2041:1513` | `login.html` | `/`, `/login` |
| Login error state | `2041:1542` | `login.html` error alert | `/login` |
| Registration — Personal Details | `2041:2181` | `register-personal.html` | `/register/personal-details` |
| Registration — ID Details | `2041:2206` | `register-id.html` | `/register/id-details` |
| Registration — Personal Details error | `2041:2231` | inline validation | `/register/personal-details` |
| Registration — ID Details error | `2041:2254` | inline validation | `/register/id-details` |
| Registration — Create Account | `2041:1574` | `register.html` | `/register/application` |
| Create Account validation/error | `2041:2144` | disabled submit | `/register/application` |
| Terms and Conditions | `2041:1634` | `terms.html` | `/terms` |
| Application received / credentials | `2041:1613` | `success.html` | `/register/success` |
| Member dashboard | `2041:1830` / `295:331` | `dashboard.html` | `/dashboard` |
| Application status — Processing | `2041:1754` | `status.html` | `/application/status` |
| Application status — For Delivery | `2130:1339` | `status.html` state | `/application/status` |
| Application status — Rejected | `2130:1444` | `status.html` state | `/application/status` |
| Legacy inquiry list | `2041:2049` | `inquiries.html` | `/inquiries` |
| Legacy new-inquiry drawer | `2041:1372` | `inquiries.html?new=1` | `/inquiries/new` |
| Legacy inquiry detail | `2041:1908` | `inquiry.html` | `/inquiries/:ticketId` |
| Expanded inquiry overview | `304:247` | `inquiries.html` | `/inquiries` |
| Expanded inquiry form | `304:248` | `inquiries.html?new=1` | `/inquiries/new` |
| Expanded inquiry detail/timeline | `304:249` | `inquiry.html` | `/inquiries/:ticketId` |
| Renewal — Step 1 Eligibility | `2041:2443` | `renewal-1.html` | `/renewal/eligibility` |
| Renewal — Step 2 Personal Details | `2041:2471` | `renewal-2.html` | `/renewal/personal-details` |
| Renewal — Step 3 Documents & Appointment | `2041:2506` | `renewal-3.html` | `/renewal/documents-appointment` |
| Renewal — Step 4 Review & Submit | `2065:1127` | `renewal-4.html` | `/renewal/review` |
| Renewal request submitted | `2069:1250` | `renewal-submitted.html` | `/renewal/submitted` |
| Renewal status — Pending | `2069:1302` | `renewal-status.html` | `/renewal/status` |
| Renewal status — Approved | `2076:1313` | `renewal-status.html` state | `/renewal/status` |
| Renewal status — Rejected | `2076:1375` | `renewal-status.html` state | `/renewal/status` |

### ADMIN UI (page `51:5`)

| Screen | Figma node | Prototype source | Rebuild route |
|---|---|---|---|
| Admin login | `217:868` | none | `/admin/login` |
| Admin dashboard | `217:911` | none | `/admin/dashboard` |
| Admin applications list | `217:1004` | none | `/admin/applications` |
| Admin application details / update status | `217:1089` | none | `/admin/applications/:applicationId` |
| Admin profile | `233:89` | none | `/admin/profile` |
| Admin renewal requests queue | `2072:1502` | none | `/admin/renewals` |
| Admin renewal details / decision | `2072:1605` | none | `/admin/renewals/:reference` |
| Admin inquiry list (older detailed) | `2057:1114` | none | `/admin/inquiries` |
| Admin inquiry details / reply | `2057:1207` | none | `/admin/inquiries/:ticketId` |

**Profile note:** Figma headers show a Profile control, but no complete member-profile frame was supplied in the brief. Use a compact view of already-entered registration/application data. Do not invent a settings area.

---

## 2. Existing prototype inventory

| File | Purpose |
|---|---|
| `css/tokens.css` | Figma-derived colors, radii, shadows, font stack |
| `css/app.css` | Shell, header, footer, shared controls |
| `css/pages.css` | Auth, registration, status, portal, inquiries, renewal |
| `js/store.js` | `localStorage` mock backend; seeded application, inquiries, renewal |
| `js/chrome.js` | Header/footer injection, route-ish nav, profile drawer, demo bar |
| `js/ui.js` | Inline SVG icons, date formatting, toast, copy, drawers, validation |
| `js/renewal.js` | Shared renewal requirements rail |
| `img/logo-mark.png` | Circular PASSTRACK logo |
| `img/plane.jpeg` | Header airplane artwork |
| `img/favicon.svg` | Favicon |

**Existing demo credentials:** `PS-12345` / `Pw-8Kq27xM`.

**Seeded member variants:**

| State | Application ID | Password |
|---|---|---|
| Processing | `PS-12345` | `Pw-8Kq27xM` |
| For Delivery | `PS-20001` | `Pw-Maria2026` |
| Rejected | `PS-20002` | `Pw-Juan2026` |

**Existing persistence key:** `passtrack.prototype.v1` (prototype only).

---

## 2a. Rebuild mock data layer

| Item | Value |
|---|---|
| Store key | `passtrack.v2` |
| Store version | `2` |
| Implemented in | `src/data/StoreProvider.jsx`, `seed.js`, `storage.js`, `selectors.js` |
| Seed members | 3 (Demo, Maria, Juan) |
| Seed applications | 8 — covers every canonical status |
| Seed inquiries | 8 — demo member has 5, mixed open/awaiting/resolved |
| Seed renewals | 3 — Pending, Approved, Rejected |
| Admin login | any non-empty username + password |
| Last registration | Persisted as `lastRegistration` for the success screen |

**Data rules:** file metadata only (`name`, `size`, `type`); no blobs in `localStorage`. All status changes append to application history. Member and admin portals read the same arrays.

---

## 3. Design tokens (from `tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--primary` / `--primary-blue` | `#2563eb` | Primary actions, links, active states |
| `--navy` | `#0b1f4b` | Headings, dark text |
| `--header-start` | `#0b2b6b` | Header gradient start |
| `--header-end` | `#1e4fd8` | Header gradient end |
| `--text` | `#0f1b3d` | Body emphasis |
| `--text-secondary` | `#5b6b8c` | Supporting copy |
| `--border` | `#d6e2f5` | Card/field borders |
| `--border-soft` | `#e8eef9` | Subtle dividers |
| `--tint` | `#eaf2ff` | Tinted panels |
| `--page-bg` | `#f4f8ff` | Page background |
| `--surface` | `#ffffff` | Cards |
| `--surface-muted` | `#f8faff` | Muted card areas |
| `--status-error` | `#dc2626` | Errors |
| Amber | bg `#fdecc8`, text `#a16207` | Pending/awaiting |
| Green | bg `#dcfce7`, text `#15803d` | Approved/resolved |
| Rose | bg `#ffe4e6`, text `#be123c` | Rejected/action required |
| Blue chip | bg `#e0edff`, text `#1d4ed8` | Current/in progress |
| Radii | 4 / 8 / 10 / 12 / 16 / 999 px | Controls, buttons, cards, panels, pills |
| Shadows | card `0 8px 12px rgba(37,99,235,.1)`; button `0 10px 10px rgba(37,99,235,.2)` | Elevation |
| Font | Inter, system fallbacks | All UI |

---

## 4. Route map and access

| Route | Access | Notes |
|---|---|---|
| `/`, `/login` | Public | Member login |
| `/register/*` | Public | Registration flow |
| `/terms` | Public | Terms |
| `/dashboard` | Member | Guarded |
| `/application/status` | Member | Guarded |
| `/inquiries*` | Member | Guarded |
| `/renewal/*` | Member | Guarded |
| `/profile` | Member | Guarded; compact profile |
| `/admin/login` | Public | Separate admin session |
| `/admin/*` (other) | Admin | Guarded |

Guards are frontend-only. Member and admin sessions are separate. Logout clears only the active role’s session and returns to that role’s login.

---

## 5. Conflict resolutions

| Conflict | Resolution |
|---|---|
| Older inquiry list/drawer (`2041:*`) vs. expanded design (`304:*`) | Use expanded `304:247`–`304:249` as primary; preserve useful older filters, search, category and attachment capability; one set of routes only |
| Inquiry categories differ between expanded form and older drawer | Merge into one deduplicated selector; no duplicate options |
| Figma progress samples show 50% and 60% | Derive progress from canonical status/stage; show “Step X of 6”; never hardcode contradictory percentages |
| Dashboard and status page could disagree | One shared application record and selectors |
| Member profile shown in header only | Compact profile from registration data; no invented settings |
| Admin designs absent from prototype | Build from brief descriptions and Figma node IDs; mark as highest visual risk |
| Admin metrics sample values (125, 64, 32, …) | Compute from seeded records; keep sample numbers only if data is absent |
| Rejected application semantics | Submitted complete, rejection at review stage, later stages N/A |
| 10-minute auto-refresh | No backend polling; show last-updated and update when local mock status changes |
| `localStorage` large files | Store metadata only; use object URLs in memory and revoke them |

---

## 6. Canonical status model

### Application

| Canonical | Label | Stage |
|---|---|---:|
| `SUBMITTED` | Submitted | 1 |
| `UNDER_REVIEW` | Under Review | 2 |
| `PROCESSING` | Processing | 3 |
| `READY_FOR_RELEASE` | Ready for Release | 4 |
| `APPROVED` | Approved | 5 |
| `FOR_DELIVERY` | For Delivery | 6 |
| `DELIVERED` | Delivered | complete |
| `REJECTED` | Rejected | review (later N/A) |

### Renewal

`PENDING` → `APPROVED` or `REJECTED`

### Inquiry

`OPEN`, `AWAITING`, `RESOLVED`; priority `LOW`, `MEDIUM`, `HIGH`

---

## 7. Reuse / replace / keep

| Action | Items |
|---|---|
| Reuse | Token values, formatting helpers, validation patterns, seed inquiry messages, Terms copy, status copy, icon paths, demo credentials |
| Replace | Multi-page HTML navigation, `chrome.js` DOM injection, query-param demo controls |
| Keep | Static prototype archived under `docs/archive/prototype/` as a read-only reference after Step 11 |

---

## 8. Scope boundaries

Implemented as **frontend mocks only**:

- Application submission, credentials, status updates
- Renewal submission and admin decisions
- Inquiry creation, replies, reopen
- Copy/download actions
- Mock email/SMS confirmations
- Sessions and route guards via `localStorage`

Not implemented: backend, database, real auth, real email/SMS, payments, file storage, cloud functions, officer notifications.

---

## 9. Open risks

| Risk | Mitigation |
|---|---|
| No Figma MCP access | Re-verify against Figma if tools become available |
| Admin screens have no prototype | Build from brief + node IDs; review with user |
| Static hosting with `BrowserRouter` | Document SPA fallback or switch to `HashRouter` |
| Seeded app shows one status at a time | Seed separate Processing/For Delivery/Rejected applications |
| Profile design undefined | Keep compact and derived from existing data |

---

## 10. Completion status (2026-11-25)

**Status: complete for the frontend-only rebuild scope.** Step 11 acceptance passed with `npm run build` green and a 96-check headless-Chrome walk against the production preview.

| Area | Status | Evidence |
|---|---|---|
| Member login | Complete | Valid/invalid credentials, saved-registration recovery, demo variants, help modal, reset |
| Registration (3 steps) + Terms | Complete | Step gating, inline validation, ID upload metadata, terms gate, generated credentials, success download |
| Dashboard + tracking | Complete | Four cards, six-stage tracker, Processing / For Delivery / Rejected variants |
| Application information | Complete | Dedicated `/application/information` page from stored application data |
| Renewal (4 steps) | Complete | Eligibility → details → documents/appointment → review → submitted → status; pending/approved/rejected; duplicate and ineligible guards |
| Member inquiries | Complete | Summary groups, search, status/priority filters, new inquiry, attachments, thread, reply, reopen |
| Admin portal | Complete | Separate session, dashboard metrics, applications list/detail/status, renewals list/detail/decision, inquiries list/detail/reply, profile |
| Shared mock state | Complete | `passtrack.v2`; admin changes visible in member views; cross-tab `storage` sync |
| Responsive + accessibility | Complete | 1440 / 1024 / 768 / 390 px no horizontal overflow; keyboard, focus, labels, contrast, sticky header |
| Local assets | Complete | `logo-mark.svg`, `plane.jpeg`, `favicon.svg`; no external runtime hosts |
| Backend | Not in scope | No server, database, real auth, email/SMS, payment, or file storage |

**Figma caveat:** Figma MCP was unavailable for the entire rebuild. Visual parity is verified against 1440 px captures of the archived static prototype (`docs/PARITY-NOTES.md`); original-Figma parity remains unconfirmed and should be re-checked if Figma access returns.

**Prototype status:** `public/prototype/` was archived to `docs/archive/prototype/` with user approval on 2026-11-25. It remains in the repository as a read-only reference and is no longer included in production builds.
