function randomInt(max) {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function generateAppId(existing = []) {
  const used = new Set(existing.map(String));
  let id;

  do {
    id = `PS-${10000 + randomInt(90000)}`;
  } while (used.has(id));

  return id;
}

export function generatePassword() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let password = "Pw-";

  for (let index = 0; index < 8; index += 1) {
    password += characters[randomInt(characters.length)];
  }

  return password;
}

export function generateInquiryId(existing = []) {
  const highest = existing.reduce((max, ticket) => {
    const value = Number(String(ticket).replace(/\D/g, ""));
    return Number.isFinite(value) && value > max ? value : max;
  }, 900);

  return `INQ-${highest + 1}`;
}

export function generateRenewalRef(existing = [], year = new Date().getFullYear()) {
  const prefix = `RN-${year}-`;
  const highest = existing.reduce((max, reference) => {
    if (!String(reference).startsWith(prefix)) return max;
    const value = Number(String(reference).slice(prefix.length));
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);

  return `${prefix}${String(highest + 1).padStart(4, "0")}`;
}

export function generateMessageId(inquiryId, messageCount = 0) {
  return `${inquiryId}-m${messageCount + 1}`;
}
