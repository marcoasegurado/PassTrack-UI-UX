import { Link } from "react-router-dom";
import { MemberLayout } from "../../components/layout/MemberLayout";
import { StageProgress } from "../../components/application/StageProgress";
import { ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { useStore } from "../../data/StoreProvider";
import { APPLICATION_STATUS } from "../../lib/constants";
import { formatDate, formatDateTime } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-semibold text-ink">{value || "—"}</dd>
    </div>
  );
}

export function ApplicationInformation() {
  const { member, application, logoutMember } = useStore();

  usePageTitle("Application Information");

  const isRejected = application?.status === APPLICATION_STATUS.REJECTED;

  return (
    <MemberLayout
      context="Application Information"
      appId={member?.appId}
      memberName={member?.name}
      email={member?.email}
      onLogout={logoutMember}
    >
      {application ? (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <Link to="/dashboard" className="inline-flex min-h-6 items-center text-brand transition-colors hover:text-brand-strong">
              Dashboard
            </Link>
            <Icon name="chevron-right" size={12} className="text-muted" />
            <span aria-current="page" className="text-muted">
              Application Information
            </span>
          </nav>

          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Application Information
              </p>
              <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
                {application.applicantName || member?.name || "Application details"}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                The details recorded for this passport application. Review updates from the
                tracking page.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-card border border-line bg-white px-4 py-3 shadow-card">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  Application ID
                </p>
                <p className="mt-1 font-mono text-base font-bold text-ink">{application.id}</p>
              </div>
              <CopyButton value={application.id} compact label="Copy" />
            </div>
          </header>

          {application.rejectionReason && (
            <div className="flex items-start gap-3 rounded-card border border-[#fecdd3] bg-rose-bg px-5 py-4 text-sm leading-relaxed text-rose-ink">
              <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">This application needs attention.</p>
                <p className="mt-1">{application.rejectionReason}</p>
                <Link to="/inquiries" className="mt-1 inline-flex min-h-6 items-center gap-1 font-bold">
                  Follow up through the inquiry desk
                  <Icon name="chevron-right" size={13} />
                </Link>
              </div>
            </div>
          )}

          <SummaryCard
            title="Application"
            action={<StatusBadge kind="application" status={application.status} dot />}
          >
            <div className="flex flex-col gap-5">
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Application type" value={application.applicationType} />
                <Field label="Passport type" value={application.passportType} />
                <Field label="Processing type" value={application.processingType} />
                <Field label="Submitted" value={formatDateTime(application.submittedAt)} />
                <Field label="Last updated" value={formatDateTime(application.updatedAt)} />
                <Field
                  label="Estimated completion"
                  value={
                    application.estimatedCompletion
                      ? formatDate(application.estimatedCompletion)
                      : "To be scheduled"
                  }
                />
              </dl>

              <StageProgress status={application.status} />

              <div className="rounded-control border border-[#dce6f3] bg-tint px-4 py-3 text-sm leading-relaxed text-slate-body">
                <p className="font-semibold text-ink">
                  {isRejected ? "Review notes" : "Current status note"}
                </p>
                <p className="mt-1">{application.note || "No officer note has been added yet."}</p>
                {application.nextStep && (
                  <p className="mt-1.5 text-xs text-muted">Next step: {application.nextStep}</p>
                )}
              </div>
            </div>
          </SummaryCard>

          <div className="grid gap-5 lg:grid-cols-2">
            <SummaryCard title="Applicant information">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" value={member?.firstName} />
                <Field label="Middle name" value={member?.middleName} />
                <Field label="Last name" value={member?.lastName} />
                <Field label="Date of birth" value={formatDate(member?.birthday)} />
                <Field label="Sex" value={member?.sex} />
                <Field label="Civil status" value={member?.civilStatus} />
                <Field label="Place of birth" value={member?.birthplace} />
                <Field label="Citizenship" value={member?.citizenship} />
                <Field label="Nationality" value={member?.nationality} />
                <Field
                  label="Uploaded ID"
                  value={member?.validId?.name || "No file on record"}
                />
              </dl>
            </SummaryCard>

            <SummaryCard title="Contact and address">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Email address" value={application.email || member?.email} />
                </div>
                <Field label="Contact number" value={application.contact || member?.contact} />
                <Field label="Postal code" value={application.postalCode} />
                <div className="sm:col-span-2">
                  <Field label="Home address" value={application.address} />
                </div>
                <Field label="City" value={application.city} />
                <Field label="Province" value={application.province} />
              </dl>
            </SummaryCard>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <ButtonLink to="/application/status">View status tracker</ButtonLink>
            <div className="flex flex-wrap gap-2">
              <ButtonLink to="/dashboard" variant="outline">
                Back to dashboard
              </ButtonLink>
              <ButtonLink to="/inquiries" variant="ghost">
                Ask about this application
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="file-text"
          title="No application on file"
          description="No passport application is linked to this member yet. Start a new application to see its details here."
          action={<ButtonLink to="/dashboard">Back to dashboard</ButtonLink>}
        />
      )}
    </MemberLayout>
  );
}
