import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

export function Stepper({ steps, current = 1, className }) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {steps.map((step, index) => {
        const label = typeof step === "string" ? step : step.label;
        const number = index + 1;
        const done = number < current;
        const isCurrent = number === current;

        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                done || isCurrent
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-muted",
              )}
            >
              {done ? <Icon name="check" size={16} /> : number}
            </span>
            <span
              className={cn(
                "text-sm font-semibold whitespace-nowrap",
                isCurrent ? "text-brand" : done ? "text-ink" : "text-muted",
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <span
                className={cn(
                  "ml-1 hidden h-0.5 w-6 rounded sm:block lg:w-10",
                  number < current ? "bg-brand" : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
