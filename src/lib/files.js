export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const ACCEPTED_FILE_LABEL = "JPG, PNG, or PDF up to 10 MB";

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateFile(file) {
  if (!file) return { ok: false, error: "Choose a file to upload." };
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { ok: false, error: "Use a JPG, PNG, or PDF file." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: "File is larger than 10 MB." };
  }
  return { ok: true, error: "" };
}

export function fileMeta(file) {
  return { name: file.name, size: file.size, type: file.type };
}
