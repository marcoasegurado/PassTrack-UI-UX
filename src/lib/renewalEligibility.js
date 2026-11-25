import { RENEWAL_STATUS } from "./constants";

/**
 * A passport may be renewed inside the six months before it expires.
 * Everything here is derived from the member's stored passport record, never
 * from what the applicant types into the eligibility form.
 */
export const RENEWAL_WINDOW_MONTHS = 6;

export const RENEWAL_ELIGIBILITY = {
  ELIGIBLE: "ELIGIBLE",
  EXPIRED: "EXPIRED",
  NOT_IN_WINDOW: "NOT_IN_WINDOW",
  NO_PASSPORT: "NO_PASSPORT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
};

function startOfDay(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseDateOnly(value) {
  if (!value) return null;
  const text = String(value).slice(0, 10);
  const date = new Date(`${text}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDateInputValue(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addMonths(date, months) {
  const next = new Date(date.getTime());
  next.setMonth(next.getMonth() + months);
  return next;
}

/**
 * Resolve the renewal state for the signed-in member.
 *
 * Blocking order matters: an existing pending or approved request is reported
 * before the passport window, so a member never starts a duplicate request.
 */
export function getRenewalEligibility(member, latestRenewal = null, now = new Date()) {
  const today = startOfDay(now);
  const passportNumber = String(member?.passport?.number || "").trim();
  const expiry = parseDateOnly(member?.passport?.expiry);
  const renewalStatus = latestRenewal?.status;
  const base = {
    passportNumber,
    expiry,
    latestRenewal: latestRenewal || null,
    windowOpensOn: null,
    today,
  };

  if (renewalStatus === RENEWAL_STATUS.PENDING) {
    return { ...base, state: RENEWAL_ELIGIBILITY.PENDING, allowed: false };
  }

  if (renewalStatus === RENEWAL_STATUS.APPROVED) {
    return { ...base, state: RENEWAL_ELIGIBILITY.APPROVED, allowed: false };
  }

  if (!passportNumber || !expiry) {
    return { ...base, state: RENEWAL_ELIGIBILITY.NO_PASSPORT, allowed: false };
  }

  if (expiry < today) {
    return { ...base, state: RENEWAL_ELIGIBILITY.EXPIRED, allowed: true };
  }

  const windowOpensOn = addMonths(expiry, -RENEWAL_WINDOW_MONTHS);

  if (today < windowOpensOn) {
    return {
      ...base,
      state: RENEWAL_ELIGIBILITY.NOT_IN_WINDOW,
      allowed: false,
      windowOpensOn,
    };
  }

  return {
    ...base,
    state: RENEWAL_ELIGIBILITY.ELIGIBLE,
    allowed: true,
    windowOpensOn,
  };
}
