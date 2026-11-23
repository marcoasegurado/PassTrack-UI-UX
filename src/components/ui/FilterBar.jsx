import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export function FilterBar({
  search,
  onSearch,
  searchPlaceholder = "Search",
  children,
  actions,
  className,
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {onSearch && (
          <div className="relative w-full sm:max-w-[280px]">
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-[42px] w-full rounded-control border border-line bg-white pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
        )}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function FilterChip({ active = false, children, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-[13px] text-ink transition hover:border-[#b9cbe6]",
        active && "border-brand bg-tint font-semibold text-brand",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
