import { useNavigate } from "react-router-dom";
import { RequirementRail } from "../../components/renewal/RequirementRail";
import { RenewalShell } from "../../components/renewal/RenewalShell";
import { Button, ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useStore } from "../../data/StoreProvider";
import { RENEWAL_STATUS, RENEWAL_STATUS_LABELS } from "../../lib/constants";
import { cn } from "../../lib/cn";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

const COPY = {
  [RENEWAL_STATUS.PENDING]:
    "Your request has been submitted and is waiting for the administrator to review your information and supporting documents.",
  [RENEWAL_STATUS.APPROVED]:
    "Your renewal request has been approved by the administrator.",
  [RENEWAL_STATUS.REJECTED]:
    "Your renewal request was rejected by the administrator. Review the reason below and contact Passport Services if you need clarification.",
};

const NEXT = {
  [RENEWAL_STATUS.PENDING]: [
    "The administrator reviews your renewal request.",
    "An approval or rejection decision is recorded.",
    "The decision appears here so you can check the result.",
  ],
  [RENEWAL_STATUS.APPROVED]: [
    "Your renewal request was approved.",
    "Attend your scheduled appointment.",
    "Bring your original documents and follow the consular office instructions.",
  ],
  [RENEWAL_STATUS.REJECTED]: [
    "The administrator reviewed your renewal request.",
    "The request was rejected. Check the reason or contact support.",
    "You may need to correct the details or submit a new request.",
  ],
};

const MARKERS = {
  done: "bg-green-ink text-white",
  current: "border-2 border-brand bg-white text-brand",
  rejected: "bg-danger text-white",
  upcoming: "border border-line bg-white text-muted",
};

function ProgressItem({ title, meta, state, tone }) {
  return (
    <div className="flex items-start gap-3.5 rounded-control px-2 py-2.5">
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          MARKERS[tone],
        )}
        aria-hidden="true"
      >
        {tone === "done" ? (
          <Icon name="check" size={14} />
        ) : tone === "rejected" ? (
          <Icon name="x" size={14} />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{meta}</p>
      </div>
      <span
        className={cn(
          "shrink-0 text-[11px] font-semibold",
          tone === "done" && "text-green-ink",
          tone === "current" && "text-brand",
          tone === "rejected" && "text-rose-ink",
          tone === "upcoming" && "text-muted",
        )}
      >
        {state}
      </span>
    </div>
  );
}

function SummaryCell({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.3px] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{value || "—"}</dd>
    </div>
  );
}

export function RenewalStatus() {
  const navigate = useNavigate();
  const { latestRenewal, resetRenewalDraft } = useStore();

  usePageTitle("Renewal Status");

  if (!latestRenewal) {
    return (
      <RenewalShell
        title="Renewal Status"
        description="Track the administrator's decision on your passport renewal request."
        rail={<RequirementRail />}
      >
        <section className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-8">
          <EmptyState
            icon="file-text"
            title="No renewal request yet"
            description="Submit a passport renewal request first. Your reference number and decision will appear here."
            action={<ButtonLink to="/renewal/eligibility">Start a renewal</ButtonLink>}
          />
        </section>
      </RenewalShell>
    );
  }

  const { ref, status, submittedAt, decisionAt, notes, draft } = latestRenewal;
  const draftData = draft || {};
  const appointment = draftData.appointment || {};
  const personal = draftData.personal || {};

  const progress = [
    {
      title: "Request submitted",
      meta: formatDate(submittedAt),
      state: "Complete",
      tone: "done",
    },
    {
      title: "Administrator review",
      meta:
        status === RENEWAL_STATUS.PENDING
          ? "Your documents and information are being checked."
          : "The review of your information and documents is complete.",
      state: status === RENEWAL_STATUS.PENDING ? "Current" : "Complete",
      tone: status === RENEWAL_STATUS.PENDING ? "current" : "done",
    },
    {
      title: "Administrator decision",
      meta:
        status === RENEWAL_STATUS.PENDING
          ? "The request will be marked Approved or Rejected."
          : `${RENEWAL_STATUS_LABELS[status]} on ${formatDate(decisionAt)}.`,
      state: status === RENEWAL_STATUS.PENDING ? "Upcoming" : RENEWAL_STATUS_LABELS[status],
      tone:
        status === RENEWAL_STATUS.APPROVED
          ? "done"
          : status === RENEWAL_STATUS.REJECTED
            ? "rejected"
            : "upcoming",
    },
  ];

  return (
    <RenewalShell
      title="Renewal Status"
      description="Track the administrator's decision on your passport renewal request."
      rail={
        <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold text-navy">What happens next?</h2>
          <ol className="mt-3 flex list-inside list-decimal flex-col gap-2.5 text-[13px] leading-relaxed text-slate-body">
            {(NEXT[status] || NEXT[RENEWAL_STATUS.PENDING]).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>

          <div className="mt-4 rounded-control bg-tint p-3.5">
            <p className="text-sm font-semibold text-ink">Need help?</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-body">
              Send an inquiry to Passport Services if you have a question about this renewal
              request.
            </p>
          </div>

          <ButtonLink to="/inquiries/new" block className="mt-3.5">
            Contact support
          </ButtonLink>
        </section>
      }
    >
      <section className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">Renewal Request Status</h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              Reference <strong className="font-mono text-ink">{ref}</strong>
              <CopyButton value={ref} compact label="Copy" />
            </p>
          </div>
          <StatusBadge kind="renewal" status={status} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-body">
          {COPY[status] || COPY[RENEWAL_STATUS.PENDING]}
        </p>

        {personal.firstName && (
          <p className="mt-1 text-xs text-muted">
            Request for{" "}
            {[personal.firstName, personal.middleName, personal.lastName]
              .filter(Boolean)
              .join(" ")}
          </p>
        )}

        <div className="mt-5 rounded-card bg-tint p-5">
          <h3 className="text-sm font-bold text-navy">Request summary</h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <SummaryCell label="Reference number" value={ref} />
            <SummaryCell label="Current passport" value={draftData.passportNumber} />
            <SummaryCell label="Date submitted" value={formatDate(submittedAt)} />
            <SummaryCell label="Processing type" value={draftData.processing} />
          </dl>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">Request progress</h3>
          <div className="mt-1.5 flex flex-col divide-y divide-line-soft">
            {progress.map((item) => (
              <ProgressItem key={item.title} {...item} />
            ))}
          </div>
        </div>

        {status === RENEWAL_STATUS.APPROVED && (
          <div className="mt-4 rounded-control border border-line p-4">
            <h3 className="text-sm font-bold text-navy">Confirmed appointment</h3>
            <dl className="mt-2 grid gap-3 sm:grid-cols-2">
              <SummaryCell label="Branch" value={appointment.branch} />
              <SummaryCell
                label="Date & time"
                value={`${formatDate(appointment.date)} · ${appointment.time || "—"}`}
              />
            </dl>
          </div>
        )}

        <div className="mt-4 rounded-control bg-tint px-4 py-3.5">
          {status === RENEWAL_STATUS.PENDING && (
            <>
              <p className="text-sm font-semibold text-ink">What should I do now?</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-body">
                No further action is required unless the administrator contacts you for
                clarification or additional information.
              </p>
            </>
          )}

          {status === RENEWAL_STATUS.APPROVED && (
            <>
              <p className="text-sm font-semibold text-ink">What should I do now?</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-body">
                Your renewal request is approved. Follow the appointment instructions above and
                bring your original documents. This demo does not send a confirmation email.
              </p>
            </>
          )}

          {status === RENEWAL_STATUS.REJECTED && (
            <>
              <p className="text-sm font-semibold text-rose-ink">Administrator notes</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-body">
                {notes ||
                  "The uploaded document was unclear. Please provide a clearer copy and contact Passport Services."}
              </p>
            </>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {status === RENEWAL_STATUS.APPROVED && (
            <Button variant="outline" onClick={() => window.print()}>
              <Icon name="printer" size={15} />
              Print appointment slip
            </Button>
          )}

          {status === RENEWAL_STATUS.REJECTED && (
            <Button
              onClick={() => {
                resetRenewalDraft();
                navigate("/renewal/eligibility");
              }}
            >
              Start a new request
            </Button>
          )}

          {status !== RENEWAL_STATUS.REJECTED && (
            <ButtonLink to="/inquiries/new" variant="outline">
              Contact support
            </ButtonLink>
          )}

          <ButtonLink to="/dashboard" variant="ghost">
            Back to dashboard
          </ButtonLink>
        </div>
      </section>
    </RenewalShell>
  );
}
