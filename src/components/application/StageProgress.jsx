import { cn } from "../../lib/cn";
import { getApplicationProgress } from "../../lib/applicationProgress";

export function StageProgress({ status, className, showLabels = true }) {
  const { stage, total, percent, delivered, rejected } = getApplicationProgress(status);

  const valueLabel = rejected
    ? "Needs attention"
    : delivered
      ? "100% Complete"
      : `${percent}% Complete`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabels && (
        <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.3px] text-muted">
          <span>
            Stage {stage} of {total}
          </span>
          <span className={cn(rejected && "text-rose-ink", delivered && "text-green-ink")}>
            {valueLabel}
          </span>
        </div>
      )}

      <progress
        className={cn("pt-progress h-2 w-full", rejected && "pt-progress--danger")}
        max={100}
        value={percent}
        aria-label="Application progress"
        aria-valuetext={`Stage ${stage} of ${total}`}
      />
    </div>
  );
}
