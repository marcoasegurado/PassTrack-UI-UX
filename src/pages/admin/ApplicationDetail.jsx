import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button, ButtonLink } from "../../components/ui/Button";
import { SelectField, TextareaField } from "../../components/ui/Field";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { APPLICATION_STATUS, APPLICATION_STATUS_LABELS } from "../../lib/constants";
import { formatDate, formatDateTime } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

function DetailRow({ label, value }) { return <div className="flex flex-wrap justify-between gap-3 border-b border-line-soft py-3 text-sm last:border-b-0"><dt className="text-muted">{label}</dt><dd className="text-right font-semibold text-ink">{value || "—"}</dd></div>; }

export function AdminApplicationDetail() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { state, updateApplicationStatus } = useStore();
  const application = state.applications.find((item) => item.id === applicationId);
  const member = application ? state.members.find((item) => item.id === application.memberId) : null;
  const [status, setStatus] = useState(application?.status || APPLICATION_STATUS.SUBMITTED);
  const [note, setNote] = useState(application?.rejectionReason || "");
  const [error, setError] = useState("");
  usePageTitle(application ? `${application.id} · Admin` : "Application Not Found");

  if (!application) return <AdminLayout title="Application not found"><section className="rounded-panel border border-line bg-surface p-8 text-center shadow-card"><p className="text-muted">This application does not exist.</p><ButtonLink to="/admin/applications" className="mt-5">Back to applications</ButtonLink></section></AdminLayout>;

  function save(event) {
    event.preventDefault();
    const result = updateApplicationStatus(application.id, status, note);
    if (!result.ok) { setError(result.error); return; }
    setError("");
    toast(`Application ${application.id} updated.`);
  }

  return (
    <AdminLayout title={application.id} description={`Review ${application.applicantName}'s passport application.`} actions={<ButtonLink to="/admin/applications" variant="outline"><span aria-hidden="true">←</span> Back to applications</ButtonLink>}>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
        <div className="flex flex-col gap-6">
          <section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Applicant</p><h2 className="mt-1 text-xl font-bold text-navy">{application.applicantName}</h2><p className="mt-1 text-sm text-muted">{application.email} · {application.contact}</p></div><StatusBadge kind="application" status={application.status} /></div><dl className="mt-5 divide-y divide-line-soft"><DetailRow label="Application type" value={application.applicationType} /><DetailRow label="Passport type" value={application.passportType} /><DetailRow label="Processing type" value={application.processingType} /><DetailRow label="Submitted" value={formatDateTime(application.submittedAt)} /><DetailRow label="Last updated" value={formatDateTime(application.updatedAt)} /></dl></section>
          <section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold text-navy">Contact and address</h2><dl className="mt-3 divide-y divide-line-soft"><DetailRow label="Email" value={member?.email || application.email} /><DetailRow label="Contact" value={member?.contact || application.contact} /><DetailRow label="Address" value={[application.address, application.city, application.province, application.postalCode].filter(Boolean).join(", ")} /></dl></section>
          <section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold text-navy">Status history</h2><ol className="mt-3 flex flex-col divide-y divide-line-soft">{(application.history || []).map((entry) => <li key={`${entry.status}-${entry.at}`} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span><StatusBadge kind="application" status={entry.status} /><span className="ml-2 text-slate-body">{entry.note}</span></span><time className="text-xs text-muted">{formatDateTime(entry.at)}</time></li>)}</ol></section>
        </div>
        <section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6"><h2 className="text-lg font-bold text-navy">Update status</h2><p className="mt-1 text-sm leading-relaxed text-muted">Changes are written to the shared mock store and appear in the member portal.</p><form onSubmit={save} className="mt-5 flex flex-col gap-5"><SelectField id="admin-application-status" label="Application status" options={Object.values(APPLICATION_STATUS).map((value) => ({ value, label: APPLICATION_STATUS_LABELS[value] }))} value={status} onChange={(event) => setStatus(event.target.value)} /><TextareaField id="admin-application-note" label={status === APPLICATION_STATUS.REJECTED ? "Rejection reason" : "Administrative note"} required={status === APPLICATION_STATUS.REJECTED} hint={status === APPLICATION_STATUS.REJECTED ? "A reason is required when rejecting an application." : "Optional context for the member record."} value={note} onChange={(event) => setNote(event.target.value)} />{error && <p role="alert" className="text-sm text-danger">{error}</p>}<Button type="submit">Save status</Button></form></section>
      </div>
    </AdminLayout>
  );
}
