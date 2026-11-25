import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidePanel } from "../../components/ui/SidePanel";
import { Button } from "../../components/ui/Button";
import { Checkbox, SelectField, TextField, TextareaField } from "../../components/ui/Field";
import { FileUploadField } from "../../components/ui/FileUploadField";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import {
  APPLICATION_STATUS_LABELS,
  INQUIRY_CATEGORIES,
  INQUIRY_PRIORITIES,
} from "../../lib/constants";
import { formatFileSize } from "../../lib/files";
import { formatDate } from "../../lib/format";

const CATEGORIES = [...new Set(INQUIRY_CATEGORIES)];
const REPLY_CHANNELS = ["Email", "SMS", "In-app"];

export function NewInquiry({ open, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { member, application, addInquiry } = useStore();

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [channels, setChannels] = useState(["Email"]);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) return;

    setCategory(CATEGORIES[0]);
    setPriority("Medium");
    setSubject("");
    setMessage("");
    setAttachments([]);
    setChannels(["Email"]);
    setErrors({});
    setFileError("");
    setFormError("");
    setSubmitting(false);
  }, [open]);

  function updateChannel(channel, checked) {
    setChannels((current) =>
      checked ? [...new Set([...current, channel])] : current.filter((item) => item !== channel),
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setFormError("");

    const nextErrors = {};
    if (!subject.trim()) nextErrors.subject = "Subject is required.";
    if (!message.trim()) nextErrors.message = "Message is required.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document
        .getElementById(nextErrors.subject ? "inquiry-subject" : "inquiry-message")
        ?.focus();
      return;
    }

    setSubmitting(true);

    const result = addInquiry({
      subject: subject.trim(),
      body: message.trim(),
      category,
      priority,
      attachments,
      replyChannels: channels,
    });

    if (!result.ok) {
      setSubmitting(false);
      setFormError(result.error);
      return;
    }

    toast(`Inquiry ${result.inquiry.id} created.`);
    onClose?.();
    navigate(`/inquiries/${result.inquiry.id}`, { replace: true });
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="New Inquiry"
      description="Tell us what you need help with. An officer will reply on the secure member channel."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="new-inquiry-form" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Inquiry"}
          </Button>
        </>
      }
    >
      <form
        id="new-inquiry-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-control border border-[#dce6f3] bg-tint px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-body">
            <span className="font-bold uppercase tracking-[0.16em] text-muted">
              Linked application
            </span>
            <strong className="font-mono text-sm text-ink">
              {application?.id || member?.appId}
            </strong>
            {application?.status && (
              <span className="font-semibold">
                · {APPLICATION_STATUS_LABELS[application.status] || application.status}
              </span>
            )}
          </div>
          {application?.submittedAt && (
            <span className="text-xs text-muted">
              Submitted {formatDate(application.submittedAt)}
            </span>
          )}
        </div>

        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-control border border-[#f9c2c2] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#b42318]"
          >
            <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id="inquiry-category"
            label="Category"
            required
            options={CATEGORIES}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          <SelectField
            id="inquiry-priority"
            label="Priority"
            hint="Choose High only if travel is within 48 hours."
            options={INQUIRY_PRIORITIES}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          />
        </div>

        <TextField
          id="inquiry-subject"
          label="Subject"
          required
          maxLength={120}
          autoComplete="off"
          placeholder="Enter a concise subject"
          value={subject}
          error={errors.subject}
          onChange={(event) => {
            setSubject(event.target.value);
            setErrors((current) => {
              if (!current.subject) return current;
              const next = { ...current };
              delete next.subject;
              return next;
            });
          }}
        />

        <TextareaField
          id="inquiry-message"
          label="Message"
          required
          maxLength={2000}
          placeholder="Describe your question or concern"
          hint="Do not include sensitive identification numbers."
          textareaClassName="min-h-36"
          value={message}
          error={errors.message}
          onChange={(event) => {
            setMessage(event.target.value);
            setErrors((current) => {
              if (!current.message) return current;
              const next = { ...current };
              delete next.message;
              return next;
            });
          }}
        />

        <div className="flex flex-col gap-3">
          <FileUploadField
            id="inquiry-attachment"
            label="Attach File"
            value={null}
            error={fileError}
            onError={setFileError}
            onChange={(file) => {
              if (!file) return;
              setAttachments((current) => [...current, file]);
            }}
            hint="Optional. JPG, PNG, or PDF up to 10 MB each."
          />

          {attachments.length > 0 && (
            <ul className="flex flex-col gap-2">
              {attachments.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-control border border-line bg-surface-muted px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-tint text-brand">
                    <Icon name="file-text" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
                    <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setAttachments((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-control border border-line bg-white text-muted hover:bg-rose-bg hover:text-danger"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-ink">Reply channels</legend>
          <p className="mt-0.5 text-xs text-muted">
            Choose how you would like to be notified about officer replies.
          </p>
          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-5">
            {REPLY_CHANNELS.map((channel) => (
              <Checkbox
                key={channel}
                id={`inquiry-channel-${channel.toLowerCase()}`}
                label={channel}
                checked={channels.includes(channel)}
                onChange={(event) => updateChannel(channel, event.target.checked)}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            This demo stores your preference only — no real email or SMS is sent.
          </p>
        </fieldset>

        <div className="flex items-start gap-2.5 rounded-control border border-[#dce6f3] bg-tint px-4 py-3 text-xs leading-relaxed text-slate-body">
          <Icon name="clock" size={15} className="mt-0.5 shrink-0 text-brand" />
          <span>Officers typically respond within one business day.</span>
        </div>
      </form>
    </SidePanel>
  );
}
