import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import { Icon } from "../ui/Icon";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "home" },
  { label: "Applications", to: "/admin/applications", icon: "file-text" },
  { label: "Inquiries", to: "/admin/inquiries", icon: "message" },
  { label: "Renewals", to: "/admin/renewals", icon: "refresh" },
  { label: "Account", to: "/admin/profile", icon: "user" },
];

export function AdminSidebar({ open = false, onClose, onLogout }) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-navy/25 lg:hidden",
          open ? "block" : "hidden",
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r border-line bg-white transition-transform duration-200 lg:sticky lg:top-[106px] lg:z-auto lg:h-[calc(100vh-106px)] lg:translate-x-0",
          open && "translate-x-0",
        )}
        aria-label="Administrator navigation"
      >
        <div className="flex items-center gap-3 border-b border-line-soft px-5 py-4">
          <img
            src="/assets/logo-mark.png"
            alt=""
            className="h-11 w-11 rounded-full bg-tint object-contain p-0.5"
          />
          <div>
            <p className="text-sm font-bold tracking-wide text-navy">PASSTRACK</p>
            <p className="text-[11px] text-muted">Administrator</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-control text-muted hover:bg-tint hover:text-brand lg:hidden"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink hover:no-underline",
                  isActive && "bg-tint font-semibold text-brand",
                )
              }
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line-soft p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-rose-bg hover:text-danger"
          >
            <Icon name="logout" size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
