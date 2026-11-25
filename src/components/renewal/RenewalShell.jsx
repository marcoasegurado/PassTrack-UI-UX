import { Link } from "react-router-dom";
import { MemberLayout } from "../layout/MemberLayout";
import { CopyButton } from "../ui/CopyButton";
import { Icon } from "../ui/Icon";
import { useStore } from "../../data/StoreProvider";

export const RENEWAL_STEPS = [
  "Eligibility",
  "Personal Details",
  "Documents",
  "Review & Submit",
];

export function RenewalShell({ title, description, children, rail }) {
  const { member, logoutMember } = useStore();

  return (
    <MemberLayout
      context="Passport Renewal"
      appId={member?.appId}
      memberName={member?.name}
      email={member?.email}
      onLogout={logoutMember}
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold">
          <Link to="/dashboard" className="inline-flex min-h-6 items-center text-brand hover:text-brand-strong">
            Dashboard
          </Link>
          <Icon name="chevron-right" size={12} className="text-muted" />
          <span aria-current="page" className="text-muted">
            Passport Renewal
          </span>
        </nav>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm leading-relaxed text-muted sm:text-[15px]">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#cfe0fa] bg-white px-3 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Application ID
            </span>
            <strong className="font-mono text-sm font-bold text-ink">{member?.appId || "—"}</strong>
            <CopyButton value={member?.appId || ""} compact label="Copy" />
          </div>
        </header>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">{children}</div>
          <aside aria-label="Renewal help" className="flex flex-col gap-4">
            {rail}
          </aside>
        </div>
      </div>
    </MemberLayout>
  );
}

export function RenewalCard({ title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
      <header className="border-b border-line-soft px-6 py-5 sm:px-7">
        <h2 className="text-xl font-bold leading-tight text-navy sm:text-2xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-muted sm:text-[15px]">{subtitle}</p>
        )}
      </header>
      <div className="px-6 py-6 sm:px-7 sm:py-7">{children}</div>
    </section>
  );
}

export function NoteStrip({ children, className = "" }) {
  return (
    <div
      className={`rounded-control border border-[#dce6f3] bg-tint px-4 py-3.5 text-sm leading-relaxed text-slate-body ${className}`}
    >
      {children}
    </div>
  );
}
