export const APPLICATION_STATUS = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  PROCESSING: "PROCESSING",
  READY_FOR_RELEASE: "READY_FOR_RELEASE",
  APPROVED: "APPROVED",
  FOR_DELIVERY: "FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  REJECTED: "REJECTED",
};

export const APPLICATION_STATUS_LABELS = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  PROCESSING: "Processing",
  READY_FOR_RELEASE: "Ready for Release",
  APPROVED: "Approved",
  FOR_DELIVERY: "For Delivery",
  DELIVERED: "Delivered",
  REJECTED: "Rejected",
};

export const APPLICATION_STATUS_STAGE = {
  SUBMITTED: 1,
  UNDER_REVIEW: 2,
  PROCESSING: 3,
  READY_FOR_RELEASE: 4,
  APPROVED: 5,
  FOR_DELIVERY: 6,
  DELIVERED: 6,
  REJECTED: 2,
};

export const APPLICATION_STEPS = [
  { key: "submitted", label: "Submitted", phase: "Intake & Verification" },
  { key: "review", label: "Under Review", phase: "Intake & Verification" },
  { key: "processing", label: "Processing", phase: "Intake & Verification" },
  { key: "ready", label: "Ready for Release", phase: "Delivery & Issuance" },
  { key: "approved", label: "Approved", phase: "Delivery & Issuance" },
  { key: "delivery", label: "For Delivery", phase: "Delivery & Issuance" },
];

export const APPLICATION_STATUS_TONE = {
  SUBMITTED: "blue",
  UNDER_REVIEW: "amber",
  PROCESSING: "blue",
  READY_FOR_RELEASE: "amber",
  APPROVED: "green",
  FOR_DELIVERY: "blue",
  DELIVERED: "green",
  REJECTED: "rose",
};

export const INQUIRY_STATUS = {
  OPEN: "OPEN",
  AWAITING: "AWAITING",
  RESOLVED: "RESOLVED",
};

export const INQUIRY_STATUS_LABELS = {
  OPEN: "Open",
  AWAITING: "Awaiting response",
  RESOLVED: "Resolved",
};

export const INQUIRY_STATUS_TONE = {
  OPEN: "blue",
  AWAITING: "amber",
  RESOLVED: "green",
};

export const INQUIRY_CATEGORIES = [
  "Document Issue",
  "Status Update",
  "Payment",
  "Delivery",
  "Complaint",
  "Document Clarification",
  "Renewal",
  "Other",
];

export const INQUIRY_PRIORITIES = ["Low", "Medium", "High"];

export const PRIORITY_TONE = {
  Low: "outline",
  Medium: "amber",
  High: "rose",
};

export const RENEWAL_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const RENEWAL_STATUS_LABELS = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const RENEWAL_STATUS_TONE = {
  PENDING: "amber",
  APPROVED: "green",
  REJECTED: "rose",
};

export const PROCESSING_TYPES = [
  {
    value: "Regular",
    label: "Regular",
    days: "10–12 working days",
    fee: "₱950",
    note: "Standard processing for most renewals.",
  },
  {
    value: "Express",
    label: "Express",
    days: "5–7 working days",
    fee: "₱1,200",
    note: "Priority handling when faster delivery is needed.",
  },
];

export const APPOINTMENT_BRANCHES = [
  "Quezon City Consular Office",
  "Makati Consular Office",
  "Manila Consular Office",
  "Cebu Consular Office",
];

export const APPOINTMENT_TIMES = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM"];

export const RENEWAL_REASONS = [
  "Expiring passport",
  "Passport validity below six months",
  "Lost passport",
  "Damaged passport",
  "Change of name",
  "Other",
];
