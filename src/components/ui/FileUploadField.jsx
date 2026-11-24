import { useId, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { ACCEPTED_FILE_LABEL, fileMeta, formatFileSize, validateFile } from "../../lib/files";
import { Icon } from "./Icon";

export function FileUploadField({
  label,
  id,
  required = false,
  hint,
  error,
  onChange,
  onError,
  value = null,
  accept = ".jpg,.jpeg,.png,.pdf",
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file) {
    if (!file) return;
    const result = validateFile(file);
    if (!result.ok) {
      onError?.(result.error);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onError?.("");
    onChange?.(fileMeta(file));
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function removeFile() {
    onError?.("");
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="flex items-center gap-1 text-sm font-semibold leading-tight text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        )}
      </span>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-control border border-dashed border-line bg-surface-muted p-4 transition",
          dragging && "border-brand bg-tint",
          error && "border-danger",
        )}
      >
        <input
          ref={inputRef}
          id={fieldId}
          type="file"
          accept={accept}
          required={required && !value}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        {value ? (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-tint text-brand">
              <Icon name="file-text" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{value.name}</p>
              <p className="text-xs text-muted">{formatFileSize(value.size)}</p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="inline-flex h-9 items-center gap-1.5 rounded-control border border-line bg-white px-3 text-xs font-semibold text-ink hover:bg-rose-bg hover:text-danger"
            >
              <Icon name="trash" size={14} />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tint text-brand">
              <Icon name="upload" size={20} />
            </span>
            <label
              htmlFor={fieldId}
              className="cursor-pointer text-sm font-semibold text-brand"
            >
              Click to upload
            </label>
            <p className="text-xs text-muted">or drag and drop · {ACCEPTED_FILE_LABEL}</p>
          </div>
        )}
      </div>

      {hint && !error && <p id={hintId} className="text-xs leading-snug text-muted">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="text-xs leading-snug text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
