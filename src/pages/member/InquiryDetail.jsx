import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { InquiryShell } from "../../components/inquiries/InquiryShell";
import { TicketInfoRail } from "../../components/inquiries/TicketRail";
import { TicketThread } from "../../components/inquiries/TicketThread";
import { Button, ButtonLink } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Field";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { INQUIRY_STATUS } from "../../lib/constants";
import { fileMeta, formatFileSize, validateFile } from "../../lib/files";
import { formatDate } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function InquiryDetail() {
  const { ticketId } = useParams();
  const toast = useToast();
  const { member, memberInquiries, addInquiryMessage, setInquiryStatus } = useStore();

  const inquiry = memberInquiries.find((item) => item.id === ticketId) || null;

  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [copyToEmail, setCopyToEmail] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  usePageTitle(inquiry ? `${inquiry.subject} · Inquiry` : "Inquiry");

  if (!inquiry) {
    return (
      <InquiryShell
        title="Inquiry not found"
        description="This ticket does not exist in your inquiry history."
        crumbs={[{ label: "My Inquiries", to: "/inquiries" }, { label: "Not found" }]}
      >
        <section className="rounded-panel border border-line bg-surface shadow-card">
          <EmptyState
            icon="file-text"
            title="Inquiry not found"
            description="The ticket may have been removed, or it belongs to another member account."
            action={<ButtonLink to="/inquiries">Back to inquiries</ButtonLink>}
          />
        </section>
      </InquiryShell>
    );
  }

  const resolved = inquiry.status === INQUIRY_STATUS.RESOLVED;

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = validateFile(file);
    if (!result.ok) {
      setAttachmentError(result.error);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setAttachmentError("");
    setAttachment(fileMeta(file));
  }

  function removeAttachment() {
    setAttachment(null);
    setAttachmentError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleReply(event) {
    event.preventDefault();
    if (sending) return;
    setError("");

    if (!reply.trim() && !attachment) {
      setError("Write a reply or attach a file.");
      document.getElementById("inquiry-reply")?.focus();
      return;
    }

    setSending(true);
    const result = addInquiryMessage(inquiry.id, {
      body: reply.trim(),
      attachments: attachment ? [attachment] : [],
      copyToEmail,
    });
    setSending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setReply("");
    setAttachment(null);
    setCopyToEmail(false);
    if (fileRef.current) fileRef.current.value = "";
    toast("Reply sent to Passport Services.");
  }

  function reopen() {
    const result = setInquiryStatus(inquiry.id, INQUIRY_STATUS.OPEN);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    toast("Inquiry reopened. You can reply again.");
  }

  return (
    <InquiryShell
      title={inquiry.subject}
      description={`Ticket ${inquiry.id} · ${inquiry.category} · opened ${formatDate(inquiry.createdAt)}`}
      crumbs={[
        { label: "Dashboard", to: "/dashboard" },
        { label: "My Inquiries", to: "/inquiries" },
        { label: inquiry.id },
      ]}
      actions={
        <ButtonLink to="/inquiries" variant="ghost">
          <Icon name="arrow-left" size={15} />
          Back to inquiries
        </ButtonLink>
      }
    >
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
          <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
                <Icon name="message" size={22} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-brand">{inquiry.id}</span>
                  <StatusBadge kind="inquiry" status={inquiry.status} />
                </div>
                <p className="mt-1 text-sm font-semibold text-ink">{inquiry.subject}</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe0fa] bg-tint px-3 py-1.5 text-[11px] font-bold text-brand">
              <Icon name="shield" size={13} />
              Secure member channel
            </span>
          </header>

          <div className="px-5 py-6 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-navy">Message thread</h2>
                <p className="text-xs text-muted">Conversation with Passport Services</p>
              </div>
            </div>

            <div className="mt-5">
              <TicketThread messages={inquiry.messages} memberName={member?.name} />
            </div>

            {resolved ? (
              <div className="mt-6 rounded-control border border-[#bbf7d0] bg-green-bg px-4 py-4">
                <p className="flex items-center gap-2 text-sm font-bold text-green-ink">
                  <Icon name="check-circle" size={16} />
                  This inquiry is resolved
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-body">
                  The conversation is closed but stays in your records. Reopen it if you need
                  further help with the same concern.
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={reopen}>
                  <Icon name="refresh" size={14} />
                  Reopen inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleReply} noValidate className="mt-6 border-t border-line-soft pt-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-navy">Reply to this inquiry</p>
                  <p className="text-xs text-muted">
                    Your reply will notify the assigned officer.
                  </p>
                </div>

                <label htmlFor="inquiry-reply" className="sr-only">
                  Message
                </label>
                <textarea
                  id="inquiry-reply"
                  value={reply}
                  onChange={(event) => {
                    setReply(event.target.value);
                    setError("");
                  }}
                  placeholder={`Type your reply to ${inquiry.assignedOfficer || "Passport Services"}…`}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "inquiry-reply-error" : undefined}
                  className="mt-2 min-h-28 w-full resize-y rounded-control border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-danger"
                />

                {error && (
                  <p id="inquiry-reply-error" role="alert" className="mt-1.5 text-xs text-danger">
                    {error}
                  </p>
                )}

                {attachment && (
                  <div className="mt-2 flex items-center gap-3 rounded-control border border-line bg-surface-muted px-3 py-2">
                    <Icon name="file-text" size={16} className="shrink-0 text-brand" />
                    <p className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">
                      {attachment.name}
                    </p>
                    <span className="text-xs text-muted">{formatFileSize(attachment.size)}</span>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      aria-label={`Remove ${attachment.name}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-control border border-line bg-white text-muted hover:bg-rose-bg hover:text-danger"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                )}

                {attachmentError && (
                  <p role="alert" className="mt-1.5 text-xs text-danger">
                    {attachmentError}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileRef}
                      id="inquiry-reply-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="sr-only"
                      onChange={handleFile}
                    />
                    <label
                      htmlFor="inquiry-reply-file"
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-control border border-line bg-white px-3 text-xs font-semibold text-ink transition hover:bg-surface-muted"
                    >
                      <Icon name="upload" size={14} />
                      {attachment ? "Replace file" : "Attach file"}
                    </label>

                    <Checkbox
                      id="inquiry-copy-email"
                      label="Email me a copy"
                      checked={copyToEmail}
                      onChange={(event) => setCopyToEmail(event.target.checked)}
                    />
                  </div>

                  <Button type="submit" disabled={sending}>
                    <Icon name="send" size={14} />
                    {sending ? "Sending…" : "Send reply"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        <aside aria-label="Ticket details" className="flex flex-col gap-4">
          <TicketInfoRail inquiry={inquiry} />
        </aside>
      </div>
    </InquiryShell>
  );
}
