# PASSTRACK Portal Improvements

## Purpose

This document records the requested improvements for the PASSTRACK member and administrator portals. These requirements are intended to guide the next implementation and parity pass while preserving the frontend-only demo scope.

## Scope Constraints

- The application remains frontend-only.
- `localStorage` remains the mock persistence layer; no backend, database, API, real authentication, email, SMS, payment, or file storage is introduced by these improvements.
- Member and administrator sessions must remain separate.
- Administrator changes must be reflected in the member portal through the shared local store after navigation or refresh.
- Existing canonical application, renewal, and inquiry statuses must not be renamed or bypassed.
- File uploads continue to store metadata only, never file blobs or base64 content.

---

## 1. Improve the Current Logo

### Requirement

Improve the current PASSTRACK logo while preserving the existing brand identity and recognizable airplane/passport visual language.

### Direction

- Review the logo mark, wordmark, spacing, contrast, and sizing at desktop and mobile widths.
- Produce a clean version that remains legible in:
  - Desktop header
  - Mobile header
  - Member portal
  - Admin portal
  - Login and registration screens
  - Browser favicon or small utility contexts, if applicable
- Keep the logo assets local under `public/assets/`.
- Do not use temporary remote image URLs.
- Ensure the logo has appropriate accessible alternative text when it communicates meaning. Decorative copies should use empty alt text.

### Acceptance Criteria

- The logo is visually clear at both large and small sizes.
- The logo does not collide with navigation, the airplane background, or the mobile menu button.
- The logo remains readable against the header gradient.
- The member and admin portals use a consistent logo treatment.

---

## 2. Keep Admin and Member Portals in Sync with `localStorage`

### Requirement

The administrator and member portals must reflect the same local mock data even though the application does not have a backend.

### Expected Behavior

- Both portals use the shared store key:

  ```text
  passtrack.v2
  ```

- Administrator mutations must persist to `localStorage`, including:
  - Application status updates
  - Application notes and rejection reasons
  - Renewal approvals and rejections
  - Renewal administrator notes
  - Inquiry replies
  - Inquiry status changes
  - Administrator profile updates
- Member pages must reflect those changes after:
  - Route navigation
  - Browser refresh
  - Reopening the relevant page
- Member and admin sessions remain separate. Logging out of one portal must not silently merge or overwrite the other session.
- The UI should clearly communicate that the data is local demo data and not connected to a live service.

### Technical Expectations

- Continue using the reducer and selectors in `src/data/`.
- Keep all writes immutable and routed through store actions.
- Avoid maintaining separate admin-only copies of application, renewal, or inquiry records.
- If multiple browser tabs are supported later, consider listening for the browser `storage` event to refresh state when another tab updates `passtrack.v2`.

### Acceptance Criteria

1. An administrator changes an application status.
2. The member portal is opened or refreshed.
3. The member sees the updated status, timeline, note, or rejection reason.
4. The same flow works for renewal decisions and inquiry replies/statuses.

---

## 3. Add an Application Information Card

### Requirement

Add an **Application Information** card to the member dashboard. Selecting the card must open the complete passport application information details.

### Dashboard Card

The card should summarize the current application using existing data only, such as:

- Applicant name
- Application ID
- Application type
- Passport type
- Processing type
- Submission date
- Current status

Do not invent additional profile or application fields.

### Detail View

When the member selects the card, navigate to a dedicated application information view, for example:

```text
/application/information
```

The detail view should include:

- Application ID
- Applicant information already present in the store
- Passport/application type
- Processing type
- Contact information already stored for the application
- Address information already stored for the application
- Submission and update timestamps
- Current canonical application status
- A link to the application status tracker

### Access Rules

- The page is member-only.
- The page must read from the active member session and shared store.
- If no application exists, show an accessible empty state with a clear next action.

### Acceptance Criteria

- The dashboard card is visibly interactive.
- The card has a clear accessible name and focus state.
- Clicking it opens the application information page.
- The page displays the active member's application details and does not expose another member's data.
- The page remains accurate after an administrator changes the application.

---

## 4. Keep the Header Locked

### Requirement

The primary header should remain visible while the user scrolls through long member or admin pages.

### Expected Behavior

- Keep the existing header sticky at the top of the viewport.
- Preserve the current z-index layering so menus, drawers, dialogs, and overlays appear correctly above or below the header as intended.
- Ensure the sticky header does not cover focused content or anchor targets.
- Ensure the mobile header remains usable when the mobile navigation menu is open.
- Avoid locking multiple nested headers that create confusing scroll behavior.

### Acceptance Criteria

- The header remains visible during vertical scrolling on desktop.
- The header remains visible during vertical scrolling on mobile.
- Navigation and account actions remain reachable.
- The header does not overlap page headings, dialogs, or mobile menus.
- Keyboard focus remains visible and is not hidden behind the sticky header.

---

## 5. Add an Admin Login Button to the Member Portal

### Requirement

Add an obvious but secondary **Admin Login** entry point in the member portal so the administrator can access the admin portal quickly during the demo.

### Placement

Preferred locations, subject to visual review:

- Footer link: **Admin Login**
- Login page secondary action
- A small utility link on the public/member login screen

The member dashboard should not imply that members can access administrator functions.

### Behavior

- The link navigates to:

  ```text
  /admin/login
  ```

- It must not merge member and admin sessions.
- It must not automatically log the member out.
- The admin login page continues to use the separate `adminSession` state.
- The link should be visually secondary and should not compete with the main member sign-in action.

### Acceptance Criteria

- The Admin Login link is easy to find on the member-facing entry screen.
- It works on desktop and mobile.
- It navigates directly to `/admin/login`.
- Member and admin sessions remain independent.

---

## 6. Replace Hover Underlines with Simple Animation

### Requirement

Remove hover underlines from interactive elements and use restrained motion or visual transitions instead.

### Expected Interaction Style

Use simple, consistent effects such as:

- Color transition
- Background tint transition
- Border-color transition
- Small icon movement, such as a subtle arrow shift
- Soft elevation or shadow change for cards
- A short opacity or transform transition where appropriate

### Accessibility Requirements

- Keep visible keyboard focus indicators separate from hover styling.
- Use `:focus-visible` for custom focus treatment.
- Respect `prefers-reduced-motion` and disable or reduce nonessential animation.
- Do not use animation that makes content difficult to read or causes layout shifts.
- Preserve clear affordances for links and buttons without relying only on color.

### Acceptance Criteria

- Hovering links does not add an underline.
- Interactive elements still clearly communicate that they are clickable.
- Keyboard users receive a visible focus state.
- Animations are short, subtle, and consistent across member and admin portals.
- Reduced-motion users do not receive unnecessary motion.

---

## 7. Restrict Passport Renewal Eligibility

### Requirement

New applicants must not be allowed to start the passport renewal flow. Passport renewal is available only to members who have an existing passport or an eligible passport expiration record.

### Eligibility Rules

#### Existing Passport Holder

An existing passport holder may continue to the renewal flow when the member has an existing passport record and the renewal rules allow it.

The eligibility screen should show the passport expiry date and explain the applicable renewal window.

#### New Applicant Without an Existing Passport

A new applicant without an existing passport must be stopped before the renewal flow begins.

Show a clear message such as:

> **New application in progress**  
> You cannot renew a passport because you do not have an existing passport record yet. Complete your new passport application first.

#### Existing Passport Not Yet Eligible

If the member has an existing passport but it is not within the allowed renewal window, show a clear message such as:

> **Your passport is not expiring yet**  
> You can start a renewal when your passport reaches the eligible renewal window. Current expiry date: **[date]**.

The exact date and eligibility window must be derived from the shared application/passport data. Do not hardcode a progress percentage or invent a passport date.

### Data Rules

- Determine eligibility from the active member record and existing application/passport data.
- Do not identify a new applicant as eligible solely because they can access the dashboard.
- Do not allow direct navigation to bypass the eligibility guard.
- Protect all later renewal routes with the same eligibility check.
- Preserve the existing nested renewal draft shape:
  - `personal`
  - `documents`
  - `appointment`
  - `confirmed`

### Expected States

| Member state | Renewal behavior |
|---|---|
| New applicant with no existing passport | Block renewal and explain that a passport record is required |
| Existing passport with expiry outside renewal window | Block renewal and show the expiry date |
| Existing passport within renewal window | Allow renewal eligibility form |
| Existing passport already expired | Allow the existing expired-passport path and show the appropriate supporting-document note |
| Existing renewal already pending or approved | Show the current renewal status and avoid creating an unintended duplicate request |

### Acceptance Criteria

- A new applicant cannot access the personal details, documents, review, or submit renewal routes by typing the URLs directly.
- A blocked applicant receives a clear, accessible explanation and a link to the appropriate new-application or dashboard action.
- An existing passport holder with an ineligible expiry date sees the correct expiry date and explanation.
- An eligible existing passport holder can complete renewal normally.
- Admin renewal records and member renewal status remain synchronized through the shared local store.

---

## Suggested Implementation Order

1. Define and test renewal eligibility selectors and route guards.
2. Add the application information detail route and dashboard card.
3. Confirm shared `localStorage` persistence across admin/member routes and refreshes.
4. Add the Admin Login entry point.
5. Improve the logo assets and header presentation.
6. Standardize hover transitions and reduced-motion behavior.
7. Complete desktop/mobile parity review for the locked header and all updated cards.

## Verification Checklist

- [ ] Improved logo is readable at desktop and mobile sizes.
- [ ] Admin and member changes persist through `passtrack.v2`.
- [ ] Application Information card opens the detail page.
- [ ] Header remains visible during scroll.
- [ ] Admin Login link works without merging sessions.
- [ ] Hover underlines are removed and replaced with simple transitions.
- [ ] New applicants are blocked from passport renewal.
- [ ] Ineligible expiry dates display the correct explanation and date.
- [ ] Eligible existing passport holders can complete renewal.
- [ ] `npm run build` passes.
- [ ] Member/admin route smoke tests pass.
- [ ] Keyboard and reduced-motion checks pass.
