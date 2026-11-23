const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = toDate(value);
  if (!date) return "—";
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}

export function formatDateLong(value) {
  const date = toDate(value);
  if (!date) return "—";
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatTime(value) {
  const date = toDate(value);
  if (!date) return "";
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return "—";
  return `${formatDate(date)} · ${formatTime(date)}`;
}

export function formatRelative(value) {
  const date = toDate(value);
  if (!date) return "—";

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const absolute = Math.abs(seconds);

  if (absolute < 60) return "just now";

  const suffix = seconds >= 0 ? "ago" : "from now";
  const minutes = Math.round(absolute / 60);
  if (minutes < 60) return `${minutes} min ${suffix}`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ${suffix}`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ${suffix}`;

  const months = Math.round(days / 30);
  if (months < 12) return `${months} mo ${suffix}`;

  const years = Math.round(months / 12);
  return `${years} yr${years === 1 ? "" : "s"} ${suffix}`;
}

export function displayTicket(ticketId) {
  if (!ticketId) return "—";
  return String(ticketId).startsWith("#") ? String(ticketId) : `#${ticketId}`;
}

export function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function titleCase(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
