import { cn } from "../../lib/cn";

export function Footer({ portal = false, bare = false, className }) {
  return (
    <footer
      className={cn(
        "mt-auto flex min-h-[52px] flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft bg-[#eaf0fa] px-4 py-3 text-[11px] text-muted sm:px-10",
        className,
      )}
    >
      <span>&copy; 2026 PASSTRACK Travel Agency. All rights reserved.</span>
      {!bare && (
        <span className="ml-auto text-[11px] text-[#8b9ab5]">
          {portal ? "Frontend demo · local mock data" : "Frontend demo · no real submissions"}
        </span>
      )}
    </footer>
  );
}
