import { Link } from "react-router-dom";
import { MemberLayout } from "../../components/layout/MemberLayout";
import { ApplicationTimeline } from "../../components/application/ApplicationTimeline";
import { ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import { APPLICATION_STATUS, APPLICATION_STATUS_LABELS } from "../../lib/constants";
import { getApplicationProgress } from "../../lib/applicationProgress";
import { formatDate, formatDateTime } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function ApplicationStatus() {
  const { member, application, logoutMember } = useStore();

  usePageTitle("Application Status");

  const progress = getApplicationProgress(application?.status);
  const isRejected = application?.status === APPLICATION_STATUS.REJECTED;
  const estimated = application?.estimatedCompletion
    ? formatDate(application.estimatedCompletion)
    : progress.estimate;

  return (
    <MemberLayout
      context="Application Status"
      appId={member?.appId}
      memberName={member?.name}
      email={member?.email}
      onLogout={logoutMember}
    >
      {application ? (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-10">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Application Tracking
                </p>
                <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
                  Application Progress
                </h1>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#cfe0fa] bg-white px-3 py-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.3px] text-muted">
                  Application ID
                </span>
                <strong className="font-mono text-sm font-bold text-ink">{member?.appId}</strong>
                <CopyButton value={member?.appId || ""} compact label="Copy" />
              </div>
            </header>

            <section
              className="mt-6 rounded-panel border border-line bg-surface-muted px-6 py-6"
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-3xl font-bold leading-none tracking-tight text-navy sm:text-4xl">
                  {APPLICATION_STATUS_LABELS[application.status] || application.status}
                </h2>
                <StatusBadge
                  kind="application"
                  status={application.status}
                  tone={progress.pill.tone}
                  className="px-3 py-2 text-[11px] uppercase tracking-[0.5px]"
                >
                  {progress.pill.label}
                </StatusBadge>
              </div>

              <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-body">
                {progress.copy}
              </p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-wrap items-baseline gap-2 text-sm">
                  <dt className="font-bold text-ink">Next step</dt>
                  <dd className="font-semibold text-ink">
                    {application.nextStep ||
                      (progress.delivered ? "None — application complete" : "To be scheduled")}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-2 text-sm">
                  <dt className="font-bold text-ink">
                    {application.estimatedCompletion ? "Estimated completion" : "Estimated time"}
                  </dt>
                  <dd className="font-semibold text-ink">{estimated}</dd>
                </div>
                {application.courier && (
                  <div className="flex flex-wrap items-baseline gap-2 text-sm sm:col-span-2">
                    <dt className="font-bold text-ink">Courier</dt>
                    <dd className="font-semibold text-ink">{application.courier}</dd>
                  </div>
                )}
              </dl>
            </section>

            {isRejected && (
              <div className="mt-5 flex items-start gap-3 rounded-card border border-[#fecdd3] bg-rose-bg px-5 py-4 text-sm leading-relaxed text-rose-ink">
                <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Why this application is paused</p>
                  <p className="mt-1">
                    {application.rejectionReason ||
                      application.note ||
                      "The review team needs corrected information before the application can continue."}
                  </p>
                  <p className="mt-2 text-xs">
                    Upload the corrected document and follow up with the review team through an
                    inquiry. This demo does not charge or resubmit automatically.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-line-soft pt-7">
              <ApplicationTimeline
                status={application.status}
                history={application.history || []}
                fallbackAt={application.submittedAt}
              />
            </div>

            <footer className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-line-soft pt-6">
              <div className="text-[13px] leading-relaxed text-muted">
                <strong className="block text-[13px] font-bold text-ink">
                  Last updated: {formatDateTime(application.updatedAt || application.submittedAt)}
                </strong>
                Updates to this demo appear as soon as the shared record changes.
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-ink">Have a question?</span>
                <ButtonLink to="/inquiries" size="pill">
                  View inquiry
                </ButtonLink>
              </div>
            </footer>
          </div>

          <p className="text-center text-xs text-muted">
            <Link to="/dashboard" className="inline-flex min-h-6 items-center">Back to dashboard</Link>
          </p>
        </div>
      ) : (
        <EmptyState
          icon="file-text"
          title="No application on file"
          description="This member session does not have an application record yet. Create one from the registration flow to see tracking here."
          action={<ButtonLink to="/register/application">Start an application</ButtonLink>}
        />
      )}
    </MemberLayout>
  );
}
