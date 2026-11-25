import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export function SidePanel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  panelClassName,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) || [],
      );

    const timer = window.setTimeout(() => {
      focusables()[0]?.focus();
    }, 30);

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-navy/30 motion-safe:animate-[pt-fade-in_0.2s_ease-out]"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "absolute inset-y-0 right-0 flex h-full w-full max-w-[560px] flex-col border-l border-line bg-surface shadow-2xl motion-safe:animate-[pt-slide-in_0.28s_cubic-bezier(0.22,1,0.36,1)]",
          panelClassName,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line-soft px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-navy">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted hover:bg-tint hover:text-brand"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className={cn("flex-1 overflow-y-auto px-5 py-5 sm:px-6", className)}>{children}</div>

        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-line-soft bg-surface-muted px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
