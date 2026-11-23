import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export function EmptyState({
  icon = "file-text",
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tint text-brand">
        <Icon name={icon} size={22} />
      </span>
      {title && <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>}
      {description && <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
