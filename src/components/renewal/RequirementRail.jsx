import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { PROCESSING_TYPES } from "../../lib/constants";

const REQUIREMENTS = [
  "Copy of your current passport (data page)",
  "One valid government-issued ID",
  "Proof of name change, if applicable",
  "Processing fee, paid at your appointment",
];

export function RequirementRail({ processing }) {
  return (
    <>
      <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-navy">Requirements checklist</h2>
        <ul className="mt-3.5 flex flex-col gap-3">
          {REQUIREMENTS.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-body">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
                <Icon name="check" size={13} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-navy">Processing time &amp; fees</h2>
        <div className="mt-3 flex flex-col">
          {PROCESSING_TYPES.map((type) => {
            const active = processing === type.value;
            return (
              <div
                key={type.value}
                className={`flex items-baseline justify-between gap-3 border-b border-line-soft py-2 text-[13px] last:border-b-0 ${
                  active ? "font-bold text-brand" : "text-slate-body"
                }`}
              >
                <span>
                  {type.label} · {type.days}
                </span>
                <strong className="text-sm font-bold">{type.fee}</strong>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2 rounded-control bg-tint p-3 text-xs leading-relaxed text-slate-body">
          <Icon name="info" size={14} className="mt-0.5 shrink-0 text-brand" />
          <span>
            Fees are paid at your appointment. Courier delivery is optional and billed
            separately.
          </span>
        </div>
      </section>

      <section className="rounded-panel border border-line bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-navy">Need help?</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          Questions about your renewal? Our support team replies within one business day.
        </p>
        <ButtonLink to="/inquiries/new" block className="mt-3.5">
          Contact support
        </ButtonLink>
      </section>
    </>
  );
}
