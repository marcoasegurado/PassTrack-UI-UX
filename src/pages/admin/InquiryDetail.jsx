import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { TicketInfoRail } from "../../components/inquiries/TicketRail";
import { TicketThread } from "../../components/inquiries/TicketThread";
import { Button, ButtonLink } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { Modal } from "../../components/ui/Modal";
import { TextareaField } from "../../components/ui/Field";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { INQUIRY_STATUS, PRIORITY_TONE } from "../../lib/constants";
import { fileMeta, formatFileSize, validateFile } from "../../lib/files";
import { formatDateTime } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

function CaseRow({ label, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft py-2.5 text-[13px] last:border-b-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold text-ink">{children || "—"}</dd>
    </div>
  );
}

export function AdminInquiryDetail() {
  const { ticketId } = useParams();
  const toast = useToast();
  const { state, addInquiryMessage, setInquiryStatus } = useStore();
  const inquiry = state.inquiries.find((item) => item.id === ticketId);

  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [closeOpen, setCloseOpen] = useState(false);
  const [closingNote, setClosingNote] = useState("");
  const [closeError, setCloseError] = useState("");
  const fileRef = useRef(null);

  usePageTitle(inquiry ? `${inquiry.id} · Admin` : "Inquiry Not Found");

  if (!inquiry) {
    return (
      <AdminLayout title="Inquiry not found">
        <section className="rounded-panel border border-line bg-surface shadow-card">
          <EmptyState
            icon="message"
            title="Inquiry not found"
            action={<ButtonLink to="/admin/inquiries">Back to inquiries</ButtonLink>}
          />
        </section>
      </AdminLayout>
    );
  }

  const resolved = inquiry.status === INQUIRY_STATUS.RESOLVED;

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = validateFile(file);
    if (!result.ok) {
      setError(result.error);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setError("");
    setAttachment(fileMeta(file));
  }

  function send(event) {
    event.preventDefault();
    const result = addInquiryMessage(inquiry.id, {
      body: reply.trim(),
      from: "support",
      attachments: attachment ? [attachment] : [],
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setReply("");
    setAttachment(null);
    if (fileRef.current) fileRef.current.value = "";
    setError("");
    toast(`Reply sent to ${inquiry.applicantName}.`);
  }

  function openCloseDialog() {
    setClosingNote("");
    setCloseError("");
    setCloseOpen(true);
  }

  function closeDialog() {
    setCloseOpen(false);
    setCloseError("");
  }

  function closeInquiry() {
    const note = closingNote.trim();

    if (note) {
      const messageResult = addInquiryMessage(inquiry.id, {
        body: note,
        from: "support",
      });

      if (!messageResult.ok) {
        setCloseError(messageResult.error);
        return;
      }
    }

    const result = setInquiryStatus(inquiry.id, INQUIRY_STATUS.RESOLVED);
    if (!result.ok) {
      setCloseError(result.error);
      return;
    }

    setCloseOpen(false);
    setClosingNote("");
    setCloseError("");
    toast(`${inquiry.id} closed and marked resolved.`);
  }

  function reopen() {
    const result = setInquiryStatus(inquiry.id, INQUIRY_STATUS.OPEN);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    toast(`${inquiry.id} reopened.`);
  }

  return (
    <AdminLayout
      title={inquiry.id}
      description={`${inquiry.subject} · ${inquiry.applicantName}`}
      actions={
        <ButtonLink to="/admin/inquiries" variant="outline">
          <span aria-hidden="true">←</span> Back to inquiries
        </ButtonLink>
      }
    >
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
        <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line-soft px-5 py-5 sm:px-7">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
                <Icon name="message" size={22} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-brand">{inquiry.id}</span>
                  <StatusBadge kind="inquiry" status={inquiry.status} />
                  <StatusBadge tone={PRIORITY_TONE[inquiry.priority] || "outline"}>
                    {inquiry.priority || "Medium"} priority
                  </StatusBadge>
                </div>
                <h2 className="mt-1 text-xl font-bold text-navy">{inquiry.subject}</h2>
                <p className="mt-1 text-sm text-muted">
                  {inquiry.category} · {inquiry.applicantName} · opened{" "}
                  {formatDateTime(inquiry.createdAt)}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe0fa] bg-tint px-3 py-1.5 text-[11px] font-bold text-brand">
              <Icon name="shield" size={13} />
              Officer view
            </span>
          </header>

          <div className="px-5 py-6 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-navy">Conversation</h2>
                <p className="text-xs text-muted">
                  Member messages appear on the left; officer replies appear on the right.
                </p>
              </div>
              <span className="text-xs font-semibold text-muted">
                {inquiry.messages?.length || 0} message
                {(inquiry.messages?.length || 0) === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-5">
              <TicketThread
                messages={inquiry.messages}
                memberName={inquiry.applicantName}
                perspective="support"
              />
            </div>

            {resolved ? (
              <div className="mt-6 rounded-control border border-[#bbf7d0] bg-green-bg px-4 py-4">
                <p className="flex items-center gap-2 text-sm font-bold text-green-ink">
                  <Icon name="check-circle" size={16} />
                  This inquiry is closed
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-body">
                  The member sees it as resolved. Reopen it if the conversation needs to continue.
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={reopen}>
                  <Icon name="refresh" size={14} />
                  Reopen inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={send} className="mt-6 border-t border-line-soft pt-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-navy">Reply to member</p>
                  <p className="text-xs text-muted">
                    The member will see this in their inquiry thread.
                  </p>
                </div>

                <label htmlFor="admin-inquiry-reply" className="sr-only">
                  Reply to member
                </label>
                <textarea
                  id="admin-inquiry-reply"
                  value={reply}
                  onChange={(event) => {
                    setReply(event.target.value);
                    setError("");
                  }}
                  placeholder="Write an officer response…"
                  className="mt-2 min-h-32 w-full resize-y rounded-control border border-line px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                />

                {attachment && (
                  <div className="mt-2 flex items-center gap-2 rounded-control bg-surface-muted px-3 py-2 text-xs">
                    <Icon name="file-text" size={14} className="shrink-0 text-brand" />
                    <span className="min-w-0 flex-1 truncate font-semibold">{attachment.name}</span>
                    <span className="shrink-0 text-muted">{formatFileSize(attachment.size)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachment(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      aria-label={`Remove ${attachment.name}`}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-control border border-line bg-white text-muted hover:bg-rose-bg hover:text-danger"
                    >
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                )}

                {error && (
                  <p role="alert" className="mt-2 text-sm text-danger">
                    {error}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <input
                      ref={fileRef}
                      id="admin-inquiry-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="sr-only"
                      onChange={handleFile}
                    />
                    <label
                      htmlFor="admin-inquiry-file"
                      className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-control border border-line bg-white px-3 text-xs font-semibold text-ink transition hover:bg-surface-muted"
                    >
                      <Icon name="upload" size={14} />
                      {attachment ? "Replace file" : "Attach file"}
                    </label>
                  </div>
                  <Button type="submit">
                    <Icon name="send" size={14} />
                    Send officer reply
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        <aside aria-label="Ticket management" className="flex flex-col gap-4">
          <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-navy">Case management</h2>
              <StatusBadge kind="inquiry" status={inquiry.status} />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Close the ticket once the member&apos;s concern is handled.
            </p>

            <dl className="mt-3 flex flex-col">
              <CaseRow label="Member">{inquiry.applicantName}</CaseRow>
              <CaseRow label="Application">
                <span className="font-mono">{inquiry.applicationId || "—"}</span>
              </CaseRow>
              <CaseRow label="Assigned officer">
                {inquiry.assignedOfficer || "Passport Services"}
              </CaseRow>
              <CaseRow label="Last updated">{formatDateTime(inquiry.updatedAt)}</CaseRow>
            </dl>

            {resolved ? (
              <div className="mt-4 rounded-control border border-[#bbf7d0] bg-green-bg px-3 py-2.5 text-xs font-semibold text-green-ink">
                Closed {formatDateTime(inquiry.updatedAt)}
              </div>
            ) : (
              <Button block className="mt-4" onClick={openCloseDialog}>
                <Icon name="check-circle" size={15} />
                Close inquiry
              </Button>
            )}

            <p className="mt-3 text-xs leading-relaxed text-muted">
              Closing marks the ticket resolved in the member portal. Members can reopen it if they
              still need help.
            </p>
          </section>

          <TicketInfoRail inquiry={inquiry} variant="admin" />
        </aside>
      </div>

      <Modal
        open={closeOpen}
        onClose={closeDialog}
        title="Close this inquiry?"
        description="The ticket will be marked resolved for the member. You can reopen it later if needed."
        footer={
          <>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={closeInquiry}>
              <Icon name="check-circle" size={15} />
              Close inquiry
            </Button>
          </>
        }
      >
        <TextareaField
          id="admin-inquiry-closing-note"
          label="Closing note (optional)"
          hint="If provided, this note is posted to the thread so the member sees why the ticket was closed."
          value={closingNote}
          onChange={(event) => {
            setClosingNote(event.target.value);
            setCloseError("");
          }}
          placeholder="Summarize the resolution or next steps…"
        />
        {closeError && (
          <p role="alert" className="mt-3 rounded-control bg-[#fff6f6] px-3 py-2 text-sm text-danger">
            {closeError}
          </p>
        )}
      </Modal>
    </AdminLayout>
  );
}
