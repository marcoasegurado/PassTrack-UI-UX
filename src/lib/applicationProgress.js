import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_STAGE,
  APPLICATION_STEPS,
} from "./constants";
import { formatDate, formatTime } from "./format";

export const APPLICATION_TOTAL_STAGES = APPLICATION_STEPS.length;

const STEP_STATUS = {
  submitted: APPLICATION_STATUS.SUBMITTED,
  review: APPLICATION_STATUS.UNDER_REVIEW,
  processing: APPLICATION_STATUS.PROCESSING,
  ready: APPLICATION_STATUS.READY_FOR_RELEASE,
  approved: APPLICATION_STATUS.APPROVED,
  delivery: APPLICATION_STATUS.FOR_DELIVERY,
};

const STATUS_COPY = {
  [APPLICATION_STATUS.SUBMITTED]:
    "Your application has been submitted and is awaiting initial review.",
  [APPLICATION_STATUS.UNDER_REVIEW]:
    "Your documents are being reviewed by a passport officer.",
  [APPLICATION_STATUS.PROCESSING]:
    "Initial checks are complete. Your application is queued for security background validation. No in-person visit is required, so keep your contact channels active.",
  [APPLICATION_STATUS.READY_FOR_RELEASE]:
    "Your passport has been printed and is awaiting release to the delivery partner.",
  [APPLICATION_STATUS.APPROVED]:
    "Your application has been approved and is awaiting delivery dispatch.",
  [APPLICATION_STATUS.FOR_DELIVERY]:
    "Your passport has been handed to the courier. Keep your phone available for the delivery contact.",
  [APPLICATION_STATUS.DELIVERED]:
    "Your passport has been delivered. Keep your passport number safe and report any issue within 48 hours.",
  [APPLICATION_STATUS.REJECTED]:
    "This application is paused. Correct the item below and follow up through an inquiry so the review team can continue.",
};

const STAGE_ESTIMATE = {
  [APPLICATION_STATUS.SUBMITTED]: "Not yet available",
  [APPLICATION_STATUS.UNDER_REVIEW]: "5–7 business days",
  [APPLICATION_STATUS.PROCESSING]: "Not yet available",
  [APPLICATION_STATUS.READY_FOR_RELEASE]: "3–5 business days",
  [APPLICATION_STATUS.APPROVED]: "2–3 business days",
  [APPLICATION_STATUS.FOR_DELIVERY]: "1–2 business days",
  [APPLICATION_STATUS.DELIVERED]: "Delivered",
  [APPLICATION_STATUS.REJECTED]: "On hold",
};

export function getApplicationProgress(status) {
  const rejected = status === APPLICATION_STATUS.REJECTED;
  const delivered = status === APPLICATION_STATUS.DELIVERED;
  const stage = delivered
    ? APPLICATION_TOTAL_STAGES
    : rejected
      ? APPLICATION_STATUS_STAGE[APPLICATION_STATUS.REJECTED]
      : APPLICATION_STATUS_STAGE[status] || 1;
  const percent = delivered
    ? 100
    : Math.round((stage / APPLICATION_TOTAL_STAGES) * 100);

  const pill = rejected
    ? { label: "Needs attention", tone: "rose" }
    : delivered
      ? { label: "Completed", tone: "green" }
      : { label: "In progress", tone: "blue" };

  return {
    stage,
    total: APPLICATION_TOTAL_STAGES,
    percent,
    delivered,
    rejected,
    pill,
    copy: STATUS_COPY[status] || STATUS_COPY[APPLICATION_STATUS.PROCESSING],
    estimate: STAGE_ESTIMATE[status] || "Not yet available",
  };
}

/**
 * Builds the six-phase timeline for a status. Every step gets a
 * done / current / attention / upcoming state derived from the canonical status.
 */
export function getTimelineSteps(status, history = [], fallbackAt = null) {
  const { stage, delivered, rejected } = getApplicationProgress(status);

  const latestByStatus = {};
  history.forEach((entry) => {
    if (entry?.status) latestByStatus[entry.status] = entry;
  });

  return APPLICATION_STEPS.map((step, index) => {
    const number = index + 1;
    const isDelivery = step.key === "delivery";
    const stepStatus =
      isDelivery && delivered ? APPLICATION_STATUS.DELIVERED : STEP_STATUS[step.key];
    const entry = latestByStatus[stepStatus];
    const isDone = delivered || number < stage;
    const isCurrent = !delivered && number === stage;
    const state = isDone ? "done" : isCurrent ? (rejected ? "attention" : "current") : "upcoming";

    let meta;
    if (isDone) {
      const at = entry?.at || fallbackAt;
      if (isDelivery && delivered) {
        meta = at ? `Delivered ${formatDate(at)}` : "Delivered";
      } else {
        meta = at ? `${formatDate(at)} · ${formatTime(at)}` : "Completed";
      }
    } else if (isCurrent) {
      meta = rejected
        ? "Action required"
        : isDelivery
          ? "Out for delivery"
          : "In progress";
    } else {
      meta = isDelivery ? "Awaiting delivery dispatch" : "Pending previous phase completion";
    }

    return {
      ...step,
      number,
      state,
      label: isDelivery && delivered ? "Delivered" : step.label,
      meta,
    };
  });
}
