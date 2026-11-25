import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";

export function Footer({ portal = false, bare = false, className }) {
  const { pathname } = useLocation();
  const inAdmin = pathname.startsWith("/admin");

  return (
    <footer
      className={cn(
        "mt-auto flex min-h-[52px] flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft bg-[#eaf0fa] px-4 py-3 text-[11px] text-muted sm:px-10",
        className,
      )}
    >
      <span>&copy; 2026 PASSTRACK Travel Agency. All rights reserved.</span>

      <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1">
        {!inAdmin && (
          <Link
            to="/admin/login"
            className="inline-flex min-h-6 items-center font-semibold text-muted transition-colors hover:text-brand"
          >
            Admin Login
          </Link>
        )}
        {!bare && (
          <span className="text-[11px] text-muted">
            {portal ? "Frontend demo · local mock data" : "Frontend demo · no real submissions"}
          </span>
        )}
      </div>
    </footer>
  );
}
