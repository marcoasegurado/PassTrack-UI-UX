import { useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button, ButtonLink } from "../../components/ui/Button";
import { TextareaField } from "../../components/ui/Field";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { RENEWAL_STATUS } from "../../lib/constants";
import { formatDate, formatDateTime } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

function Row({ label, value }) { return <div className="flex flex-wrap justify-between gap-3 border-b border-line-soft py-3 text-sm last:border-b-0"><dt className="text-muted">{label}</dt><dd className="text-right font-semibold text-ink">{value || "—"}</dd></div>; }

export function AdminRenewalDetail() {
  const { reference } = useParams();
  const toast = useToast();
  const { state, decideRenewal } = useStore();
  const renewal = state.renewals.find((item) => item.ref === reference);
  const [notes, setNotes] = useState(renewal?.notes || "");
  const [error, setError] = useState("");
  const [pendingDecision, setPendingDecision] = useState(null);
  usePageTitle(renewal ? `${renewal.ref} · Admin` : "Renewal Not Found");
  if (!renewal) return <AdminLayout title="Renewal not found"><section className="rounded-panel border border-line bg-surface p-8 text-center shadow-card"><p className="text-muted">This renewal request does not exist.</p><ButtonLink to="/admin/renewals" className="mt-5">Back to renewals</ButtonLink></section></AdminLayout>;

  function decide(status) {
    const result = decideRenewal(renewal.ref, status, notes);
    if (!result.ok) { setError(result.error); return; }
    setError("");
    setPendingDecision(null);
    toast(`${renewal.ref} marked ${status.toLowerCase()}.`);
  }
  const draft = renewal.draft || {};
  const personal = draft.personal || {};
  const appointment = draft.appointment || {};
  const docs = draft.documents || {};
  return <AdminLayout title={renewal.ref} description={`Review ${renewal.applicantName}'s renewal request.`} actions={<ButtonLink to="/admin/renewals" variant="outline">← Back to renewals</ButtonLink>}>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]"><div className="flex flex-col gap-6">
      <section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-sm font-bold text-brand">{renewal.ref}</p><h2 className="mt-1 text-xl font-bold text-navy">{renewal.applicantName}</h2><p className="mt-1 text-sm text-muted">Submitted {formatDateTime(renewal.submittedAt)}</p></div><StatusBadge kind="renewal" status={renewal.status} /></div><dl className="mt-5 divide-y divide-line-soft"><Row label="Application" value={renewal.applicationId} /><Row label="Passport number" value={draft.passportNumber} /><Row label="Passport expiry" value={formatDate(draft.expiry)} /><Row label="Reason" value={draft.reason} /><Row label="Processing" value={draft.processing} /><Row label="Appointment" value={[appointment.branch, formatDate(appointment.date), appointment.time].filter(Boolean).join(" · ")} /></dl></section>
      <section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold text-navy">Personal and documents</h2><dl className="mt-3 divide-y divide-line-soft"><Row label="Full name" value={[personal.firstName, personal.middleName, personal.lastName].filter(Boolean).join(" ")} /><Row label="Email" value={personal.email || renewal.email} /><Row label="Contact" value={personal.contact} /><Row label="Address" value={[personal.address, personal.city, personal.province, personal.postalCode].filter(Boolean).join(", ")} /><Row label="Passport copy" value={docs.passportCopy?.name} /><Row label="Government ID" value={docs.governmentId?.name} /><Row label="Supporting files" value={`${docs.supporting?.length || 0} file(s)`} /></dl></section>
    </div><section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold text-navy">Decision</h2><p className="mt-1 text-sm leading-relaxed text-muted">Approve or reject this request. A rejection note is required.</p><TextareaField id="admin-renewal-notes" className="mt-5" label="Administrator notes" required={renewal.status === RENEWAL_STATUS.PENDING} value={notes} onChange={(event) => { setNotes(event.target.value); setError(""); }} hint="The note is shown on the member's renewal status page." />{error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}{renewal.status === RENEWAL_STATUS.PENDING ? <div className="mt-5 grid gap-3"><Button onClick={() => setPendingDecision(RENEWAL_STATUS.APPROVED)}>Approve renewal</Button><Button variant="danger" onClick={() => setPendingDecision(RENEWAL_STATUS.REJECTED)}>Reject renewal</Button></div> : <div className="mt-5 rounded-control bg-tint p-3 text-sm leading-relaxed text-slate-body">Decision recorded {formatDateTime(renewal.decisionAt)}. The member portal reads this shared record immediately.</div>}</section></div>
      <Modal
        open={Boolean(pendingDecision)}
        onClose={() => setPendingDecision(null)}
        title={`${pendingDecision === RENEWAL_STATUS.REJECTED ? "Reject" : "Approve"} renewal request?`}
        description="This decision is written to the shared local store and will be visible to the member."
        footer={<><Button variant="outline" onClick={() => setPendingDecision(null)}>Cancel</Button><Button variant={pendingDecision === RENEWAL_STATUS.REJECTED ? "danger" : "primary"} onClick={() => decide(pendingDecision)}>Confirm {pendingDecision === RENEWAL_STATUS.REJECTED ? "rejection" : "approval"}</Button></>}
      >
        <p className="text-sm leading-relaxed text-slate-body">{pendingDecision === RENEWAL_STATUS.REJECTED ? "The member will see the administrator notes as the rejection reason." : "The renewal status will change to Approved and the member will see the confirmed appointment details."}</p>
      </Modal>
    </AdminLayout>;
}
