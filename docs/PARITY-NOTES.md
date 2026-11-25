# PASSTRACK — Step 10 Verification Record

> **Date:** 2026-11-24
> **Scope:** Step 10 — integration, responsive behaviour, accessibility, and visual parity.
> **Method:** headless Chrome driven over the DevTools Protocol against a production build
> (`npm run build` + `vite preview`). Every route was loaded with its required store fixture
> (member session, admin session, registration draft, or renewal draft) so guarded pages rendered
> their real content instead of redirecting.

---

## 1. Responsive sweep

28 routes × 6 viewports = **168 combinations**, measured with
`document.documentElement.scrollWidth − clientWidth`.

| Viewport | Result |
|---|---|
| 1440 × 900 | no horizontal overflow |
| 1280 × 800 | no horizontal overflow |
| 1024 × 768 | no horizontal overflow |
| 768 × 1024 | no horizontal overflow |
| 390 × 844 | no horizontal overflow |
| 320 × 720 | no horizontal overflow |

- **Console errors and failed requests:** 0 across all routes.
- Tables below 720 px scroll inside their own `overflow-x-auto` region, which is why the page
  itself never overflows.
- The header plane decoration no longer pushes the layout past 1024–1279 px.

## 2. Visual parity vs. the prototype

Step 1 deferred 1440 px reference screenshots because none existed. They were captured during this
pass by loading the prototype HTML files at 1440 × 900 with the prototype's own demo session
(`PS-12345`), then compared side by side with the equivalent React route. The prototype now lives in
`docs/archive/prototype/` and is no longer served by the app.

Reference captures were **not committed** (16 PNGs, several MB). To regenerate, serve
`docs/archive/prototype/` as a static folder, log in through its `login.html` so the prototype store
is written, then screenshot each page at 1440 px.

### Screen-by-screen result

| Screen | Result |
|---|---|
| Member login | Matches: gradient header, logo block, centred panel, error alert slot, register line |
| Registration step 1 | Matches field grid, stepper, `+63` prefix |
| Terms | Matches TOC + 11 numbered sections + accept/decline footer |
| Success | Matches credential blocks and copy controls |
| Dashboard | Matches 4-card grid, header Application ID, status card geometry |
| Application status | Matches two-phase six-step tracker, status hero, next-step/estimate row |
| Inquiries | Deliberately expanded (summary cards + status groups + priority) per design `304:247`–`304:249`; prototype only has the simple table |
| Renewal step 1 | Near-identical layout, stepper, fee cards, requirement rail |
| Renewal steps 2–4, submitted, status | Match the prototype's card/rail composition |
| Admin screens | No prototype exists — built from the brief |

### Deliberate differences (not defects)

- React header shows `Dashboard` / `Profile` / `Logout` actions; the prototype only shows `Logout`.
- The prototype's bottom "Preview · Privacy · Accessibility · Help Center" bar is prototype demo
  chrome and is intentionally not reproduced.
- Member dashboard adds an "Application Information" card and a "Current phase" strip.
- Inquiry screens use the expanded design rather than the old table.
- The eligibility screen adds an explicit in-window/not-in-window callout (it shows the real
  expiry date rather than a hardcoded percentage).

## 3. Accessibility audit

Automated checks per route: `lang`, `main` landmark, `h1` count, heading order, accessible names on
links/buttons, form-field labelling, `img` alt, duplicate ids, dangling `aria-*` references,
`aria-invalid` + `aria-describedby` pairing, positive `tabindex`, 24 px target size, text contrast
(computed from the rendered colour stack), and presence of `:focus-visible` styling.

### Fixed in this pass

| Issue | Where | Fix |
|---|---|---|
| Demo footer label at 2.48:1 | `Footer` | `#8b9ab5` → `text-muted` (≈4.7:1) |
| Amber status/priority badges at 4.22:1 | `--color-amber-ink` | `#a16207` → `#854d0e` (≈5.9:1) |
| `h1 → h3` heading skip on renewal empty states | `EmptyState` | title is now `h2` |
| File inputs had no accessible name | `FileUploadField` | `aria-label`, `aria-invalid`, `aria-describedby` wired to hint/error ids |
| Admin sign-in had no `main` landmark | `pages/admin/Login` | wrapper is now `<main>` |
| 17 px tap targets: TOC, breadcrumbs, table links, back links | 8 files | `inline-flex min-h-6 items-center` |

### Residual findings (accepted)

Four links remain below 24 px tall. All are in the middle of a sentence, which is the explicit
inline exception in WCAG 2.2 SC 2.5.8:

- `Register for a new passport` (login)
- `Terms and Conditions` and `Login` (create-account step)
- `View renewal status` (renewal eligibility)
- `renewal status` (renewal submitted)

Padding them would break the sentence line flow, so they are left as-is.

### Confirmed already sound

- One `h1` and one `main` per screen; no skipped heading levels elsewhere.
- Every form field has a label; every link/button has an accessible name.
- No duplicate ids, no dangling `aria-describedby`/`aria-labelledby`/`aria-controls`.
- No positive `tabindex`.
- `:focus-visible` defined once globally (3 px outline, 2 px offset) and inherited everywhere.
- Modals: `role="dialog"`, `aria-modal`, labelled + described, focus moved in, Tab trapped,
  Escape closes, focus restored, background scroll locked.
- Tables: real `<table>` with `th scope="col"`, scroll containers are focusable and labelled.
- Toasts use `aria-live="polite"`; form errors use `role="alert"`.
- Skip-to-content link targets a real `#main-content`.

## 4. Functional control sweep

44 scripted end-to-end checks, all passing. Covered:

- Member login, logout, copy-to-clipboard feedback.
- Dashboard → tracker navigation; all six stages and both phases render.
- Inquiry: create with attachment metadata → detail → member reply → search filter.
- Renewal: eligibility → personal details → documents/appointment → review → submit, producing
  `RN-YYYY-####`.
- Admin login (separate session), dashboard metrics, application search and status filter,
  renewal tab filter, application status update, inquiry reply and status change, renewal approval
  through the confirmation modal.
- Cross-portal sync: admin status change appears on the member dashboard; admin renewal approval
  appears on the member renewal status page; admin reply appears in the member thread.
- Modal keyboard behaviour (focus enters dialog, Escape closes).
- Member logout does not touch the admin session.
- Store invariants: no file blobs or base64 written to `localStorage`.

## 5. Build

`npm run build` completes with no errors. The only output is Vite's informational
"chunks larger than 500 kB" notice, which is expected for a single-bundle SPA and is not an error.
