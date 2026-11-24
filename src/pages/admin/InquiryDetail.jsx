import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { TicketInfoRail } from "../../components/inquiries/TicketRail";
import { TicketThread } from "../../components/inquiries/TicketThread";
import { Button, ButtonLink } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Field";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { SelectField } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { INQUIRY_STATUS, INQUIRY_STATUS_LABELS } from "../../lib/constants";
import { fileMeta, formatFileSize, validateFile } from "../../lib/files";
import { usePageTitle } from "../../lib/usePageTitle";

export function AdminInquiryDetail() {
  const { ticketId } = useParams();
  const toast = useToast();
  const { state, addInquiryMessage, setInquiryStatus } = useStore();
  const inquiry = state.inquiries.find((item) => item.id === ticketId);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(inquiry?.status || INQUIRY_STATUS.OPEN);
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  usePageTitle(inquiry ? `${inquiry.id} · Admin` : "Inquiry Not Found");
  if (!inquiry) return <AdminLayout title="Inquiry not found"><section className="rounded-panel border border-line bg-surface shadow-card"><EmptyState icon="message" title="Inquiry not found" action={<ButtonLink to="/admin/inquiries">Back to inquiries</ButtonLink>} /></section></AdminLayout>;

  function updateStatus(event) {
    const result = setInquiryStatus(inquiry.id, event.target.value);
    if (!result.ok) { setError(result.error); return; }
    setStatus(event.target.value);
    toast(`Ticket ${inquiry.id} updated.`);
  }
  function handleFile(event) {
    const file = event.target.files?.[0]; if (!file) return;
    const result = validateFile(file); if (!result.ok) { setError(result.error); return; }
    setError(""); setAttachment(fileMeta(file));
  }
  function send(event) {
    event.preventDefault();
    const result = addInquiryMessage(inquiry.id, { body: reply.trim(), from: "support", attachments: attachment ? [attachment] : [] });
    if (!result.ok) { setError(result.error); return; }
    setReply(""); setAttachment(null); if (fileRef.current) fileRef.current.value = ""; setError(""); toast(`Reply sent to ${inquiry.applicantName}.`);
  }
  return <AdminLayout title={inquiry.id} description={`${inquiry.subject} · ${inquiry.applicantName}`} actions={<ButtonLink to="/admin/inquiries" variant="outline">← Back to inquiries</ButtonLink>}><div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_340px]"><section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card"><header className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft px-5 py-5 sm:px-7"><div><p className="font-mono text-sm font-bold text-brand">{inquiry.id}</p><h2 className="mt-1 text-xl font-bold text-navy">{inquiry.subject}</h2><p className="mt-1 text-sm text-muted">{inquiry.category} · {inquiry.applicantName}</p></div><div className="w-48"><SelectField id="admin-inquiry-status" label="Status" options={Object.values(INQUIRY_STATUS).map((value) => ({ value, label: INQUIRY_STATUS_LABELS[value] }))} value={status} onChange={updateStatus} /></div></header><div className="px-5 py-6 sm:px-7"><TicketThread messages={inquiry.messages} memberName={inquiry.applicantName} /><form onSubmit={send} className="mt-6 border-t border-line-soft pt-5"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-navy">Reply to member</h3><span className="text-xs text-muted">Member will see this in their inquiry thread.</span></div><textarea id="admin-inquiry-reply" aria-label="Reply to member" value={reply} onChange={(event) => { setReply(event.target.value); setError(""); }} placeholder="Write an officer response…" className="mt-2 min-h-32 w-full resize-y rounded-control border border-line px-4 py-3 text-sm leading-relaxed outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />{attachment && <div className="mt-2 flex items-center gap-2 rounded-control bg-surface-muted px-3 py-2 text-xs"><Icon name="file-text" size={14} className="text-brand" /><span className="flex-1 truncate font-semibold">{attachment.name}</span><span>{formatFileSize(attachment.size)}</span></div>}{error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}<div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div><input ref={fileRef} id="admin-inquiry-file" type="file" accept=".jpg,.jpeg,.png,.pdf" className="sr-only" onChange={handleFile} /><label htmlFor="admin-inquiry-file" className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-control border border-line px-3 text-xs font-semibold"><Icon name="upload" size={14} />Attach file</label></div><Button type="submit"><Icon name="send" size={14} />Send officer reply</Button></div></form></div></section><aside><TicketInfoRail inquiry={inquiry} /></aside></div></AdminLayout>;
}
