import { useNavigate } from "react-router-dom";
import { MemberLayout } from "../../components/layout/MemberLayout";
import { Button } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { useStore } from "../../data/StoreProvider";
import { APPLICATION_STATUS, APPLICATION_STATUS_LABELS } from "../../lib/constants";
import { formatDate, formatDateTime } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function Dashboard() {
  const navigate = useNavigate();
  const { member, application, logoutMember } = useStore();

  usePageTitle("Dashboard");

  const firstName = member?.firstName || "Member";
  const history = [...(application?.history || [])].reverse().slice(0, 4);

  return (
    <MemberLayout
      context="Dashboard"
      appId={member?.appId}
      memberName={member?.name}
      email={member?.email}
      onLogout={logoutMember}
    >
      <div className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Member Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Here is the latest state of your passport application.
            </p>
          </div>
          <div className="rounded-card border border-line bg-white px-4 py-3 shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Application ID
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-base font-bold text-ink">
                {member?.appId}
              </span>
              <CopyButton value={member?.appId || ""} compact label="Copy" />
            </div>
          </div>
        </header>

        {application?.status === APPLICATION_STATUS.REJECTED && (
          <div className="flex items-start gap-3 rounded-card border border-[#f5c2c7] bg-rose-bg px-5 py-4 text-sm leading-relaxed text-rose-ink">
            <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">This application needs attention.</p>
              <p className="mt-1">
                {application.rejectionReason ||
                  "The review team needs corrected information before the application can continue."}
              </p>
              <p className="mt-1 text-xs">
                Reply to your inquiry or prepare the requested documents. Admin decisions in
                this demo update this card immediately.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Application Status" bodyClassName="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <StatusBadge status={application?.status} dot />
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {application?.nextStep || "No next step recorded."}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-tint text-brand">
                <Icon name="file-text" size={20} />
              </span>
            </div>
          </SummaryCard>

          <SummaryCard title="Application ID" bodyClassName="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-lg font-bold text-ink">
                  {member?.appId}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {application
                    ? APPLICATION_STATUS_LABELS[application.status]
                    : "No application on file"}
                </p>
              </div>
              <CopyButton value={member?.appId || ""} compact label="Copy" />
            </div>
          </SummaryCard>

          <SummaryCard title="Processing Type" bodyClassName="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-ink">
                  {application?.processingType || "—"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {application?.applicationType || "New Passport"}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-tint text-brand">
                <Icon name="clock" size={20} />
              </span>
            </div>
          </SummaryCard>

          <SummaryCard title="Estimated Completion" bodyClassName="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-ink">
                  {application?.estimatedCompletion
                    ? formatDate(application.estimatedCompletion)
                    : "To be scheduled"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {application?.rejectionReason
                    ? "Paused until documents are corrected"
                    : "Subject to review and courier schedules"}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-tint text-brand">
                <Icon name="calendar" size={20} />
              </span>
            </div>
          </SummaryCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <SummaryCard
            title="What happens next"
            subtitle="Updates here come from the same mock record used by the admin portal."
          >
            <p className="text-sm leading-relaxed text-slate-body">
              {application?.note ||
                "Your application is being prepared. Check back after the next review update."}
            </p>

            <div className="mt-4 rounded-control border border-line bg-surface-muted p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Next step
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {application?.nextStep || "Initial document check"}
              </p>
              <p className="mt-2 text-xs text-muted">
                Last updated {formatDateTime(application?.updatedAt)}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                Recent activity
              </p>
              {history.length ? (
                <ol className="mt-3 space-y-3">
                  {history.map((entry, index) => (
                    <li key={`${entry.status}-${entry.at}-${index}`} className="flex gap-3">
                      <span
                        className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {APPLICATION_STATUS_LABELS[entry.status] || entry.status}
                        </p>
                        <p className="text-xs text-muted">{formatDateTime(entry.at)}</p>
                        {entry.note && (
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-body">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 text-sm text-muted">No activity recorded yet.</p>
              )}
            </div>
          </SummaryCard>

          <SummaryCard title="Demo account" subtitle="Member session and local data">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Member
                </dt>
                <dd className="mt-0.5 font-semibold text-ink">{member?.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Email
                </dt>
                <dd className="mt-0.5 break-all text-ink">{member?.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Submitted
                </dt>
                <dd className="mt-0.5 text-ink">{formatDate(application?.submittedAt)}</dd>
              </div>
            </dl>

            <p className="mt-4 rounded-control bg-tint p-3 text-xs leading-relaxed text-slate-body">
              Tracking, inquiry, and renewal screens are being added next. The header Profile
              panel and Logout already use the shared member session.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                logoutMember();
                navigate("/login");
              }}
            >
              Switch account
            </Button>
          </SummaryCard>
        </div>
      </div>
    </MemberLayout>
  );
}
