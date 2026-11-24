import { cn } from "../../lib/cn";
import { Icon } from "../ui/Icon";
import { getApplicationProgress, getTimelineSteps } from "../../lib/applicationProgress";

const MARKERS = {
  done: "border-brand bg-brand text-white",
  current: "border-2 border-brand bg-white text-brand",
  attention: "border-2 border-danger bg-rose-bg text-rose-ink",
  upcoming: "border border-line bg-white text-muted",
};

export function ApplicationTimeline({
  status,
  history = [],
  fallbackAt,
  className,
}) {
  const { stage, rejected, delivered } = getApplicationProgress(status);
  const steps = getTimelineSteps(status, history, fallbackAt);
  const visualStage = delivered ? 6 : stage;
  const fillWidth = `${((visualStage - 1) / 5) * 83.3333}%`;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="hidden grid-cols-2 gap-4 text-center text-xs font-bold text-slate-body sm:grid sm:text-sm">
        <span>Phase A: Intake &amp; Verification</span>
        <span>Phase B: Delivery &amp; Issuance</span>
      </div>

      <div className="relative grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-6 sm:gap-x-2 sm:gap-y-0">
        <span
          className="absolute left-[8.3333%] right-[8.3333%] top-6 hidden h-0.5 bg-[#b9c6da] sm:block"
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute left-[8.3333%] top-6 hidden h-0.5 sm:block",
            rejected ? "bg-danger" : "bg-brand",
          )}
          style={{ width: fillWidth }}
          aria-hidden="true"
        />

        {steps.map((step) => (
          <div
            key={step.key}
            className="relative z-10 flex flex-col items-center gap-2 text-center"
            aria-current={step.state === "current" || step.state === "attention" ? "step" : undefined}
          >
            <span
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold",
                MARKERS[step.state],
              )}
            >
              {step.state === "done" ? (
                <Icon name="check" size={20} />
              ) : (
                step.number
              )}
            </span>
            <span
              className={cn(
                "text-sm font-semibold leading-tight",
                step.state === "upcoming" ? "text-muted" : "text-ink",
              )}
            >
              {step.label}
            </span>
            <span className="max-w-[150px] text-xs leading-snug text-muted">{step.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
