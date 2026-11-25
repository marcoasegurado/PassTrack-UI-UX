import { useId } from "react";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { RENEWAL_STATUS_LABELS } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import { cn } from "../../lib/cn";
import { RENEWAL_ELIGIBILITY } from "../../lib/renewalEligibility";

const TONES = {
  info: {
    panel: "border-[#cfe0fa] bg-tint",
    icon: "bg-white text-brand",
  },
  amber: {
    panel: "border-[#fde68a] bg-amber-bg",
    icon: "bg-white text-amber-ink",
  },
  green: {
    panel: "border-[#bbf7d0] bg-green-bg",
    icon: "bg-white text-green-ink",
  },
};

function Detail({ label, value }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

function contentFor(eligibility) {
  const { state, latestRenewal, expiry, windowOpensOn } = eligibility;
  const reference = latestRenewal?.ref;
  const submitted = latestRenewal?.submittedAt ? formatDate(latestRenewal.submittedAt) : null;
  const decided = latestRenewal?.decisionAt
    ? formatDate(latestRenewal.decisionAt)
    : submitted;

  switch (state) {
    case RENEWAL_ELIGIBILITY.NO_PASSPORT:
      return {
        tone: "info",
        icon: "file-text",
        title: "New application in progress",
        body:
          "You cannot renew a passport because you do not have an existing passport record yet. Complete your new passport application first.",
        details: [],
        actions: (
          <>
            <ButtonLink to="/application/status">View application status</ButtonLink>
            <ButtonLink to="/dashboard" variant="outline">
              Back to dashboard
            </ButtonLink>
          </>
        ),
      };

    case RENEWAL_ELIGIBILITY.NOT_IN_WINDOW:
      return {
        tone: "info",
        icon: "calendar",
        title: "Your passport is not expiring yet",
        body: `You can start a renewal when your passport reaches the eligible renewal window. Current expiry date: ${formatDate(expiry)}.`,
        details: [
          { label: "Current expiry date", value: formatDate(expiry) },
          { label: "Renewal window opens", value: formatDate(windowOpensOn) },
        ],
        actions: (
          <>
            <ButtonLink to="/dashboard" variant="outline">
              Back to dashboard
            </ButtonLink>
            <ButtonLink to="/application/status" variant="ghost">
              View application status
            </ButtonLink>
          </>
        ),
      };

    case RENEWAL_ELIGIBILITY.PENDING:
      return {
        tone: "amber",
        icon: "clock",
        title: "Renewal already in progress",
        body: `Renewal request ${reference || "on file"} was submitted ${
          submitted ? `on ${submitted} ` : ""
        }and is currently ${RENEWAL_STATUS_LABELS[latestRenewal?.status] || "pending review"}. You cannot start another renewal while this request is open.`,
        details: [
          reference ? { label: "Reference", value: reference } : null,
          submitted ? { label: "Submitted", value: submitted } : null,
        ].filter(Boolean),
        actions: (
          <ButtonLink to="/renewal/status">View renewal status</ButtonLink>
        ),
      };

    case RENEWAL_ELIGIBILITY.APPROVED:
      return {
        tone: "green",
        icon: "check-circle",
        title: "Renewal already approved",
        body: `Renewal request ${reference || "on file"} was approved ${
          decided ? `on ${decided} ` : ""
        }and a new request cannot be started. A new renewal becomes available six months before your renewed passport expires.`,
        details: [
          reference ? { label: "Reference", value: reference } : null,
          decided ? { label: "Approved", value: decided } : null,
        ].filter(Boolean),
        actions: (
          <ButtonLink to="/renewal/status">View renewal status</ButtonLink>
        ),
      };

    default:
      return null;
  }
}

/**
 * Explains why the renewal flow is unavailable. Used both on the eligibility
 * screen and by the route guard on the later renewal steps.
 */
export function RenewalEligibilityNotice({ eligibility, className }) {
  const titleId = useId();
  const content = contentFor(eligibility);

  if (!content) return null;

  const tone = TONES[content.tone] || TONES.info;

  return (
    <section
      aria-labelledby={titleId}
      className={cn("rounded-card border px-5 py-6 sm:px-6", tone.panel, className)}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            "flex h-10 w-10 flex-none items-center justify-center rounded-full",
            tone.icon,
          )}
          aria-hidden="true"
        >
          <Icon name={content.icon} size={20} />
        </span>

        <div className="min-w-0">
          <h2 id={titleId} className="text-lg font-bold leading-tight text-navy sm:text-xl">
            {content.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-body">{content.body}</p>

          {content.details.length > 0 && (
            <dl className="mt-4 flex max-w-md flex-col gap-1.5 rounded-control border border-white/70 bg-white/70 px-4 py-3">
              {content.details.map((detail) => (
                <Detail key={detail.label} label={detail.label} value={detail.value} />
              ))}
            </dl>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">{content.actions}</div>
        </div>
      </div>
    </section>
  );
}
