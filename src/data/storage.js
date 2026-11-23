import { createSeedState } from "./seed";

export const STORE_KEY = "passtrack.v2";
export const STORE_VERSION = 2;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadState() {
  const seed = createSeedState();

  if (!canUseStorage()) return seed;

  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return seed;

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STORE_VERSION) return seed;

    return {
      ...seed,
      ...parsed,
      version: STORE_VERSION,
      members: Array.isArray(parsed.members) ? parsed.members : seed.members,
      applications: Array.isArray(parsed.applications)
        ? parsed.applications
        : seed.applications,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : seed.inquiries,
      renewals: Array.isArray(parsed.renewals) ? parsed.renewals : seed.renewals,
      adminProfile: { ...seed.adminProfile, ...(parsed.adminProfile || {}) },
      registrationDraft: parsed.registrationDraft || {},
      renewalDraft: parsed.renewalDraft || {},
      memberSession: parsed.memberSession || null,
      adminSession: parsed.adminSession || null,
      lastRegistration: parsed.lastRegistration || null,
    };
  } catch {
    return seed;
  }
}

export function saveState(state) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be blocked or full; the in-memory state still works.
  }
}

export function clearState() {
  if (!canUseStorage()) return;

  try {
    window.localStorage.removeItem(STORE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
