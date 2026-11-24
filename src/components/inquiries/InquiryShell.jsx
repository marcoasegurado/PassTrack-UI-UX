import { Link } from "react-router-dom";
import { MemberLayout } from "../layout/MemberLayout";
import { CopyButton } from "../ui/CopyButton";
import { Icon } from "../ui/Icon";
import { useStore } from "../../data/StoreProvider";

const DEFAULT_CRUMBS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "My Inquiries" },
];

export function InquiryShell({ title, description, actions, crumbs = DEFAULT_CRUMBS, children }) {
  const { member, logoutMember } = useStore();

  return (
    <MemberLayout
      context="My Inquiries"
      appId={member?.appId}
      memberName={member?.name}
      email={member?.email}
      onLogout={logoutMember}
    >
      <div className="mx-auto flex w-full max-w-[1220px] flex-col gap-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <Icon name="chevron-right" size={12} className="text-muted" />}
              {crumb.to ? (
                <Link to={crumb.to} className="text-brand hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-muted">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{title}</h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-[#cfe0fa] bg-white px-3 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Application ID
              </span>
              <strong className="font-mono text-sm font-bold text-ink">
                {member?.appId || "—"}
              </strong>
              <CopyButton value={member?.appId || ""} compact label="Copy" />
            </div>
            {actions}
          </div>
        </header>

        {children}
      </div>
    </MemberLayout>
  );
}
