import { Link, useNavigate } from "react-router-dom";
import { MemberLayout } from "../../components/layout/MemberLayout";
import { StageProgress } from "../../components/application/StageProgress";
import { Button, ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  INQUIRY_STATUS,
  RENEWAL_STATUS,
} from "../../lib/constants";
import { getApplicationProgress, getTimelineSteps } from "../../lib/applicationProgress";
import { getRenewalEligibility, RENEWAL_ELIGIBILITY } from "../../lib/renewalEligibility";
import { formatDate, formatRelative } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

const DOT_TONES = {
  green: "bg-green-ink",
  blue: "bg-brand",
  amber: "bg-amber-ink",
  rose: "bg-danger",
};

function statusDotTone(status) {
  if (status === APPLICATION_STATUS.REJECTED) return "rose";
  if (status === APPLICATION_STATUS.DELIVERED) return "green";
  const stage = getApplicationProgress(status).stage;
  if (stage >= 4) return "green";
  if (stage >= 2) return "blue";
  return "amber";
}

function Eyebrow({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
      {children}
    </p>
  );
}

function Card({ children, className = "" }) {
  return (
    <article
      className={`flex flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-shadow duration-200 ${className}`}
    >
      {children}
    </article>
  );
}

function TicketLine({ inquiry }) {
  if (!inquiry) return null;

  const tone =
    inquiry.status === INQUIRY_STATUS.RESOLVED
      ? { icon: "check-circle", className: "text-green-ink" }
      : inquiry.status === INQUIRY_STATUS.AWAITING
        ? { icon: "clock", className: "text-amber-ink" }
        : { icon: "message", className: "text-brand" };

  const label =
    inquiry.status === INQUIRY_STATUS.RESOLVED
      ? "Completed"
      : inquiry.status === INQUIRY_STATUS.AWAITING
        ? "awaiting your reply"
        : "open";

  return (
    <div className="flex items-start gap-2 text-sm text-slate-body">
      <Icon name={tone.icon} size={16} className={`mt-0.5 shrink-0 ${tone.className}`} />
      <span>
        Ticket <strong className="font-semibold text-ink">#{inquiry.id}</strong>: {label}
      </span>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const {
    member,
    application,
    memberInquiries,
    latestRenewal,
    logoutMember,
  } = useStore();

  usePageTitle("Dashboard");

  const firstName = member?.firstName || "Member";
  const status = application?.status;
  const progress = getApplicationProgress(status);
  const steps = getTimelineSteps(status, application?.history || [], application?.submittedAt);
  const currentStep = steps[progress.stage - 1] || steps[0];

  const activeInquiries = memberInquiries.filter(
    (inquiry) => inquiry.status !== INQUIRY_STATUS.RESOLVED,
  );
  const awaitingInquiry = memberInquiries.find(
    (inquiry) => inquiry.status === INQUIRY_STATUS.AWAITING,
  );
  const resolvedInquiry = memberInquiries.find(
    (inquiry) => inquiry.status === INQUIRY_STATUS.RESOLVED,
  );

  const isRejected = status === APPLICATION_STATUS.REJECTED;
  const dotTone = statusDotTone(status);
  const eligibility = getRenewalEligibility(member, latestRenewal);
  const renewalCta = latestRenewal
    ? { to: "/renewal/status", label: "View renewal" }
    : eligibility.allowed
      ? { to: "/renewal/eligibility", label: "Renew passport" }
      : eligibility.state === RENEWAL_ELIGIBILITY.NO_PASSPORT
        ? { to: "/application/status", label: "View application" }
        : { to: "/renewal/eligibility", label: "Check eligibility" };

  const documentState = isRejected
    ? "Document review paused"
    : progress.stage >= 3
      ? "Document security validated"
      : progress.stage === 2
        ? "Documents under review"
        : "Awaiting initial document check";

  const expiry = member?.passport?.expiry;
  const renewalState =
    latestRenewal?.status === RENEWAL_STATUS.PENDING
      ? "Renewal request under review"
      : latestRenewal?.status === RENEWAL_STATUS.APPROVED
        ? "Renewal approved"
        : latestRenewal?.status === RENEWAL_STATUS.REJECTED
          ? "Renewal needs attention"
          : "Renewal queue open";
  const renewalTitle =
    latestRenewal?.status === RENEWAL_STATUS.PENDING
      ? "Renewal in progress"
      : latestRenewal?.status === RENEWAL_STATUS.APPROVED
        ? "Renewal approved"
        : latestRenewal?.status === RENEWAL_STATUS.REJECTED
          ? "Renewal needs attention"
          : "Current Passport Expiring";

  return (
    <MemberLayout
      context="Dashboard"
      appId={member?.appId}
      memberName={member?.name}
      email={member?.email}
      onLogout={logoutMember}
    >
      <div className="flex flex-col gap-5">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Welcome, {firstName}!
            </h1>
            <p className="mt-1 text-sm text-muted">PASSTRACK Travel Agency</p>
          </div>

          <div className="rounded-card border border-line bg-white px-4 py-3 shadow-card">
            <Eyebrow>Application ID</Eyebrow>
            <div className="mt-1 flex items-center gap-2">
              <strong className="font-mono text-base font-bold text-ink">
                {member?.appId || "—"}
              </strong>
              <CopyButton value={member?.appId || ""} compact label="Copy" />
            </div>
          </div>
        </section>

        {isRejected && (
          <div className="flex items-start gap-3 rounded-card border border-[#fecdd3] bg-rose-bg px-5 py-4 text-sm leading-relaxed text-rose-ink">
            <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">This application needs attention.</p>
              <p className="mt-1">
                {application.rejectionReason ||
                  "The review team needs corrected information before the application can continue."}
              </p>
              <Link to="/inquiries" className="mt-1 inline-block text-xs font-bold underline">
                Follow up through the inquiry desk
              </Link>
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <Eyebrow>Application Status</Eyebrow>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${DOT_TONES[dotTone]}`}
                aria-hidden="true"
              />
              <strong className="text-xl font-bold leading-tight text-ink">
                {APPLICATION_STATUS_LABELS[status] || "No application"}
              </strong>
              <StatusBadge status={status} dot className="ml-auto" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-body">{progress.copy}</p>

            <div className="mt-5">
              <StageProgress status={status} />
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-xs text-muted">
                Updated {formatRelative(application?.updatedAt || application?.submittedAt)}
              </span>
              <ButtonLink to="/application/status" size="pill">
                View status
              </ButtonLink>
            </div>
          </Card>

          <Card>
            <Eyebrow>Inquiry</Eyebrow>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  activeInquiries.length ? DOT_TONES.blue : DOT_TONES.green
                }`}
                aria-hidden="true"
              />
              <strong className="text-xl font-bold leading-tight text-ink">
                {activeInquiries.length} Active{" "}
                {activeInquiries.length === 1 ? "Inquiry" : "Inquiries"}
              </strong>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-body">
              {awaitingInquiry
                ? "An officer has replied to one of your tickets. Review the latest response and reply if you need to."
                : activeInquiries.length
                  ? "Your open inquiries are with the review team. No action is pending from your side."
                  : "You have no open inquiries. Start a new ticket if you need help with this application."}
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {memberInquiries.length ? (
                <>
                  <TicketLine inquiry={awaitingInquiry || activeInquiries[0]} />
                  <TicketLine inquiry={resolvedInquiry} />
                </>
              ) : (
                <p className="text-sm text-muted">No inquiry tickets yet.</p>
              )}
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-xs text-muted">
                {memberInquiries.length
                  ? `${memberInquiries.length} ticket${memberInquiries.length === 1 ? "" : "s"} on record`
                  : "Inquiry desk ready"}
              </span>
              <ButtonLink to="/inquiries" size="pill">
                View inquiry
              </ButtonLink>
            </div>
          </Card>

          <Link
            to="/application/information"
            className="group flex flex-col rounded-card border border-line bg-surface p-6 shadow-card transition duration-200 motion-safe:hover:-translate-y-0.5 hover:border-brand/45 hover:shadow-[0_16px_32px_rgba(37,99,235,0.16)]"
          >
            <Eyebrow>Application Information</Eyebrow>
            <strong className="mt-2 text-2xl font-bold leading-tight text-ink">
              {member?.name || "Member"}
            </strong>
            <p className="mt-1 text-sm leading-relaxed text-slate-body">
              Passport Type: {application?.passportType || "—"} · Processing Type:{" "}
              {application?.processingType || "—"}
            </p>

            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-body">
              <div className="flex flex-wrap gap-1.5">
                <strong className="font-semibold text-ink">Primary Email:</strong>
                <span className="break-all">{member?.email || "—"}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <strong className="font-semibold text-ink">Submission Date:</strong>
                <span>{formatDate(application?.submittedAt)}</span>
              </div>
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-xs font-semibold text-muted">{documentState}</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12px] text-brand">
                View details
                <Icon
                  name="chevron-right"
                  size={14}
                  className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </Link>

          <Card>
            <Eyebrow>Passport Renewal</Eyebrow>
            <strong className="mt-2 text-2xl font-bold leading-tight text-ink">
              {renewalTitle}
            </strong>
            <p className="mt-1 text-sm leading-relaxed text-slate-body">
              {expiry
                ? `Your current physical book expires on ${formatDate(expiry)}. Keep in mind that many airlines require 6 months validity.`
                : "No current passport is recorded yet. Renewal becomes available after your first passport is delivered."}
            </p>

            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <span className="text-xs text-muted">{renewalState}</span>
              <ButtonLink to={renewalCta.to} size="pill">
                {renewalCta.label}
              </ButtonLink>
            </div>
          </Card>
        </div>

        <section className="rounded-card border border-line bg-surface-muted px-5 py-4 text-sm text-slate-body">
          <p className="font-semibold text-ink">
            Current phase: {currentStep?.label || "Awaiting application"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {currentStep?.meta || "Updates appear as the shared application record changes."} ·
            Last updated {formatRelative(application?.updatedAt || application?.submittedAt)}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <ButtonLink to="/application/status" variant="outline" size="sm">
              Open full tracker
            </ButtonLink>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logoutMember();
                navigate("/login");
              }}
            >
              Switch account
            </Button>
          </div>
        </section>
      </div>
    </MemberLayout>
  );
}
