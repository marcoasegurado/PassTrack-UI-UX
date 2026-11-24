import { Link, useLocation } from "react-router-dom";
import { RenewalShell } from "../../components/renewal/RenewalShell";
import { ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { useStore } from "../../data/StoreProvider";
import { RENEWAL_STATUS, RENEWAL_STATUS_LABELS } from "../../lib/constants";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function RenewalSubmitted() {
  const location = useLocation();
  const { latestRenewal } = useStore();

  usePageTitle("Renewal Request Submitted");

  const reference = latestRenewal?.ref || location.state?.ref;

  return (
    <RenewalShell
      title="Renewal Request Submitted"
      description="Your renewal request has been sent to the administrator."
      rail={
        <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold text-navy">What happens next?</h2>
          <ol className="mt-3 flex list-inside list-decimal flex-col gap-2.5 text-[13px] leading-relaxed text-slate-body">
            <li>The administrator reviews your details and documents.</li>
            <li>A decision is recorded as approved or rejected.</li>
            <li>The result appears on your Renewal Status page.</li>
          </ol>
          <p className="mt-4 rounded-control bg-tint p-3 text-xs leading-relaxed text-slate-body">
            This demo stores the request locally. No email or SMS is sent.
          </p>
        </section>
      }
    >
      <section className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-8">
        {reference ? (
          <>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-bg text-green-ink">
                <Icon name="check" size={26} />
              </span>
              <div>
                <h2 className="text-2xl font-bold leading-tight text-navy">
                  Renewal Request Submitted
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Your passport renewal request has been received.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-card bg-tint p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3px] text-muted">
                Renewal reference number
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <p className="font-mono text-2xl font-bold text-brand">{reference}</p>
                <CopyButton value={reference} compact label="Copy" />
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">
                Status:{" "}
                {latestRenewal
                  ? RENEWAL_STATUS_LABELS[latestRenewal.status]
                  : RENEWAL_STATUS_LABELS[RENEWAL_STATUS.PENDING]}
              </p>
              {latestRenewal?.submittedAt && (
                <p className="mt-1 text-xs text-muted">
                  Submitted {formatDate(latestRenewal.submittedAt)}
                </p>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-body">
              The administrator will review your submitted information and documents, then
              approve or reject the renewal request. You can check the decision on the Renewal
              Status page.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/renewal/status">View Renewal Status</ButtonLink>
              <ButtonLink to="/dashboard" variant="outline">
                Back to Dashboard
              </ButtonLink>
            </div>

            <p className="mt-4 text-xs text-muted">
              Please keep your renewal reference number for future inquiries. See{" "}
              <Link to="/renewal/status" className="font-semibold text-brand hover:underline">
                renewal status
              </Link>{" "}
              for the latest decision.
            </p>
          </>
        ) : (
          <EmptyState
            icon="file-text"
            title="No renewal request found"
            description="Submit a renewal request first, then this page will show the reference number."
            action={<ButtonLink to="/renewal/eligibility">Start a renewal</ButtonLink>}
          />
        )}
      </section>
    </RenewalShell>
  );
}
