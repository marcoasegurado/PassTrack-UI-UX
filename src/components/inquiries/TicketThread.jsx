import { cn } from "../../lib/cn";
import { formatDateTime, initials } from "../../lib/format";
import { formatFileSize } from "../../lib/files";
import { Icon } from "../ui/Icon";

export function AttachmentList({ attachments = [], className }) {
  if (!attachments.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {attachments.map((file, index) => (
        <li
          key={`${file.name}-${index}`}
          className="inline-flex max-w-full items-center gap-2 rounded-control border border-line bg-white px-2.5 py-1.5 text-xs"
        >
          <Icon name="file-text" size={14} className="shrink-0 text-brand" />
          <span className="truncate font-semibold text-ink">{file.name}</span>
          <span className="shrink-0 text-muted">{formatFileSize(file.size)}</span>
        </li>
      ))}
    </ul>
  );
}

export function TicketThread({ messages = [], memberName, perspective = "member" }) {
  if (!messages.length) {
    return (
      <p className="rounded-control bg-surface-muted px-4 py-5 text-center text-sm text-muted">
        No messages yet. Send the first reply below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {messages.map((message) => {
        const fromMember = message.from === "member";
        const mine = perspective === "support" ? !fromMember : fromMember;
        const author = fromMember
          ? memberName || message.author || "Member"
          : message.author || "Passport Services";

        return (
          <article
            key={message.id}
            className={cn("flex items-start gap-3", mine && "flex-row-reverse")}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                mine ? "bg-brand text-white" : "bg-tint text-brand",
              )}
              aria-hidden="true"
            >
              {initials(author) || "PS"}
            </span>

            <div className={cn("min-w-0 max-w-[85%]", mine && "items-end text-right")}>
              <div className={cn("flex flex-wrap items-baseline gap-2", mine && "justify-end")}>
                <strong className="text-sm font-bold text-ink">{mine ? "You" : author}</strong>
                <span className="text-[11px] font-semibold text-muted">
                  {message.role || (fromMember ? "Member" : "Passport Services")}
                </span>
              </div>

              <div
                className={cn(
                  "mt-1.5 rounded-card border px-4 py-3 text-left text-sm leading-relaxed whitespace-pre-line",
                  mine
                    ? "border-[#cfe0fa] bg-tint text-slate-body"
                    : "border-line bg-surface-muted text-slate-body",
                )}
              >
                {message.body}
              </div>

              <AttachmentList attachments={message.attachments} className="mt-2" />

              <div
                className={cn(
                  "mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted",
                  mine && "justify-end",
                )}
              >
                <span>{formatDateTime(message.at)}</span>
                {message.copyToEmail && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 font-semibold">
                    <Icon name="mail" size={11} />
                    Email copy
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
