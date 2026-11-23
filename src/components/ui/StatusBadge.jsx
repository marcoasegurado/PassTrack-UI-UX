import { cn } from "../../lib/cn";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONE,
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_TONE,
  RENEWAL_STATUS_LABELS,
  RENEWAL_STATUS_TONE,
} from "../../lib/constants";

const TONES = {
  blue: "bg-chip-bg text-chip-ink",
  amber: "bg-amber-bg text-amber-ink",
  green: "bg-green-bg text-green-ink",
  rose: "bg-rose-bg text-rose-ink",
  outline: "border border-line bg-white text-muted",
  primary: "border border-brand bg-tint text-brand",
};

const MAPS = {
  application: {
    labels: APPLICATION_STATUS_LABELS,
    tones: APPLICATION_STATUS_TONE,
  },
  inquiry: {
    labels: INQUIRY_STATUS_LABELS,
    tones: INQUIRY_STATUS_TONE,
  },
  renewal: {
    labels: RENEWAL_STATUS_LABELS,
    tones: RENEWAL_STATUS_TONE,
  },
};

export function StatusBadge({
  status,
  kind = "application",
  tone,
  uppercase = false,
  dot = false,
  className,
  children,
}) {
  const map = MAPS[kind] || MAPS.application;
  const resolvedTone = tone || map.tones[status] || "outline";
  const label = children || map.labels[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold leading-none whitespace-nowrap",
        TONES[resolvedTone] || TONES.outline,
        uppercase && "px-3 py-2 text-[11px] uppercase tracking-[0.5px]",
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {label}
    </span>
  );
}
