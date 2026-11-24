import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";
import { PRIORITY_TONE } from "../../lib/constants";
import { formatDateTime } from "../../lib/format";

function InfoRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line-soft py-2.5 text-[13px] last:border-b-0">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-right font-semibold text-ink">{children || "—"}</dd>
    </div>
  );
}

export function TicketInfoRail({ inquiry }) {
  return (
    <>
      <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-navy">Ticket Information</h2>
        <dl className="mt-2 flex flex-col">
          <InfoRow label="Status">
            <StatusBadge kind="inquiry" status={inquiry.status} />
          </InfoRow>
          <InfoRow label="Category">{inquiry.category}</InfoRow>
          <InfoRow label="Assigned officer">{inquiry.assignedOfficer || "Passport Services"}</InfoRow>
          <InfoRow label="Priority">
            <StatusBadge tone={PRIORITY_TONE[inquiry.priority] || "outline"}>
              {inquiry.priority || "Medium"}
            </StatusBadge>
          </InfoRow>
          <InfoRow label="Created">{formatDateTime(inquiry.createdAt)}</InfoRow>
          <InfoRow label="Last updated">{formatDateTime(inquiry.updatedAt)}</InfoRow>
          <InfoRow label="Messages">{inquiry.messages?.length || 0}</InfoRow>
        </dl>

        {inquiry.replyChannels?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {inquiry.replyChannels.map((channel) => (
              <span
                key={channel}
                className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-slate-body"
              >
                <Icon name="mail" size={11} />
                {channel}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2 rounded-control bg-tint p-3 text-xs leading-relaxed text-slate-body">
          <Icon name="info" size={14} className="mt-0.5 shrink-0 text-brand" />
          <span>
            Officers usually respond within one business day. Replies remain attached to your
            application record.
          </span>
        </div>
      </section>

      {inquiry.applicationId && <RelatedApplicationCard applicationId={inquiry.applicationId} />}
    </>
  );
}

function RelatedApplicationCard({ applicationId }) {
  return (
    <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-navy">Related application</h2>
        <span className="font-mono text-xs font-bold text-muted">{applicationId}</span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-body">
        This ticket is linked to your passport application record. Track the latest status on the
        application page.
      </p>
      <ButtonLink to="/application/status" block className="mt-3.5">
        View application
      </ButtonLink>
    </section>
  );
}
