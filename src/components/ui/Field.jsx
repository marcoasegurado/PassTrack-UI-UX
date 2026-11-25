import { useId } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

const inputBase =
  "w-full rounded-control border border-line bg-surface text-base text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/10 read-only:cursor-default read-only:border-line-soft read-only:bg-surface-muted read-only:text-slate-body read-only:focus:border-line-soft read-only:focus:ring-0";

function FieldShell({ id, label, required, hint, error, className, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm font-semibold leading-tight text-ink"
      >
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children({ describedBy, invalid: Boolean(error) })}

      {hint && (
        <p id={hintId} className="text-xs leading-snug text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs leading-snug text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  id,
  required = false,
  hint,
  error,
  className,
  inputClassName,
  prefix,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      {({ describedBy, invalid }) =>
        prefix ? (
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
              {prefix}
            </span>
            <input
              id={fieldId}
              required={required}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              className={cn(inputBase, "h-11 pl-[3.4rem] pr-4", inputClassName)}
              {...props}
            />
          </div>
        ) : (
          <input
            id={fieldId}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(inputBase, "h-11 px-4", inputClassName)}
            {...props}
          />
        )
      }
    </FieldShell>
  );
}

export function SelectField({
  label,
  id,
  required = false,
  hint,
  error,
  className,
  selectClassName,
  options = [],
  placeholder,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      {({ describedBy, invalid }) => (
        <div className="relative">
          <select
            id={fieldId}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              inputBase,
              "h-11 cursor-pointer appearance-none px-4 pr-11",
              !props.value && "text-muted",
              selectClassName,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const labelText = typeof option === "string" ? option : option.label;
              return (
                <option key={value} value={value}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <Icon
            name="chevron-down"
            size={18}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      )}
    </FieldShell>
  );
}

export function TextareaField({
  label,
  id,
  required = false,
  hint,
  error,
  className,
  textareaClassName,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <FieldShell
      id={fieldId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      {({ describedBy, invalid }) => (
        <textarea
          id={fieldId}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(inputBase, "min-h-24 resize-y px-4 py-3 leading-relaxed", textareaClassName)}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function Checkbox({ label, id, error, className, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={fieldId}
        className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-ink"
      >
        <input
          id={fieldId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          className="pt-checkbox mt-0.5"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Radio({ label, id, className, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-base text-ink",
        className,
      )}
    >
      <input
        id={fieldId}
        type="radio"
        className="h-[18px] w-[18px] accent-brand"
        {...props}
      />
      {label}
    </label>
  );
}
