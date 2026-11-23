export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isPresent(value) {
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined && value !== "";
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || "").trim());
}

export function isValidPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidDate(value) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export function isPastDate(value) {
  const date = new Date(value);
  return isValidDate(value) && date.getTime() < Date.now();
}

export function isFutureDate(value) {
  const date = new Date(value);
  return isValidDate(value) && date.getTime() > Date.now();
}

export function validateRequiredFields(fields) {
  const errors = {};

  Object.entries(fields).forEach(([name, config]) => {
    const { value, label = name, required = true } = config;
    if (required && !isPresent(value)) {
      errors[name] = `${label} is required.`;
      return;
    }

    if (config.type === "email" && isPresent(value) && !isValidEmail(value)) {
      errors[name] = "Enter a valid email address.";
      return;
    }

    if (config.type === "phone" && isPresent(value) && !isValidPhone(value)) {
      errors[name] = "Enter a valid contact number.";
      return;
    }

    if (config.type === "date" && isPresent(value) && !isValidDate(value)) {
      errors[name] = "Enter a valid date.";
    }
  });

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
