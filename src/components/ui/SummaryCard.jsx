import { cn } from "../../lib/cn";

export function SummaryCard({
  title,
  subtitle,
  action,
  children,
  footer,
  className,
  bodyClassName,
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-card border border-line bg-surface shadow-card",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft bg-surface-muted px-5 py-4 sm:px-6">
          <div>
            {title && <h2 className="text-lg font-bold leading-tight text-navy">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm leading-snug text-muted">{subtitle}</p>}
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </header>
      )}

      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>

      {footer && <div className="border-t border-line-soft px-5 py-4 sm:px-6">{footer}</div>}
    </section>
  );
}
