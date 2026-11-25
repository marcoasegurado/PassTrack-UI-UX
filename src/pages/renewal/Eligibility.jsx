import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RenewalEligibilityNotice } from "../../components/renewal/RenewalEligibilityNotice";
import { RequirementRail } from "../../components/renewal/RequirementRail";
import { NoteStrip, RenewalCard, RenewalShell, RENEWAL_STEPS } from "../../components/renewal/RenewalShell";
import { Button, ButtonLink } from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../data/StoreProvider";
import { PROCESSING_TYPES, RENEWAL_REASONS, RENEWAL_STATUS } from "../../lib/constants";
import { cn } from "../../lib/cn";
import { formatDate } from "../../lib/format";
import { getRenewalEligibility, RENEWAL_ELIGIBILITY, toDateInputValue } from "../../lib/renewalEligibility";
import { validateRequiredFields } from "../../lib/validation";
import { usePageTitle } from "../../lib/usePageTitle";

export function RenewalEligibility() {
  const navigate = useNavigate();
  const { state, member, latestRenewal, saveRenewalDraft } = useStore();
  const draft = state.renewalDraft || {};
  const eligibility = getRenewalEligibility(member, latestRenewal);

  const [reason, setReason] = useState(draft.reason || RENEWAL_REASONS[0]);
  const [processing, setProcessing] = useState(draft.processing || "Regular");
  const [errors, setErrors] = useState({});

  usePageTitle("Passport Renewal · Eligibility");

  const passportNumber = eligibility.passportNumber;
  const expiryValue = toDateInputValue(eligibility.expiry);

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRequiredFields({
      reason: { value: reason, label: "Reason for Renewal" },
      processing: { value: processing, label: "Processing Type" },
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document.getElementById("renewal-reason")?.focus();
      return;
    }

    // The passport fields always come from the member record, never from input.
    saveRenewalDraft({
      passportNumber,
      expiry: expiryValue,
      reason,
      processing,
    });

    navigate("/renewal/personal-details");
  }

  if (!eligibility.allowed) {
    return (
      <RenewalShell
        title="Passport Renewal"
        description="Renew your passport in a few simple steps."
        rail={<RequirementRail processing={processing} />}
      >
        <RenewalCard
          title="Eligibility Check"
          subtitle="Renewal is not available for this application yet."
        >
          <RenewalEligibilityNotice eligibility={eligibility} />
        </RenewalCard>
      </RenewalShell>
    );
  }

  const expired = eligibility.state === RENEWAL_ELIGIBILITY.EXPIRED;

  return (
    <RenewalShell
      title="Passport Renewal"
      description="Renew your passport in a few simple steps."
      rail={<RequirementRail processing={processing} />}
    >
      <RenewalCard
        title="Eligibility Check"
        subtitle="We checked your passport record. Confirm the renewal details below."
      >
        <Stepper steps={RENEWAL_STEPS} current={1} className="mb-6" />

        {latestRenewal?.status === RENEWAL_STATUS.REJECTED && (
          <div className="mb-6 flex items-start gap-3 rounded-control border border-[#fecdd3] bg-rose-bg px-4 py-3 text-sm leading-relaxed text-rose-ink">
            <Icon name="alert-circle" size={17} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-ink">Your last renewal request was rejected.</p>
              <p className="mt-0.5 text-xs">
                {latestRenewal.notes ||
                  "The review team needs corrected information before the renewal can continue."}{" "}
                You can submit a corrected request below.{" "}
                <Link to="/renewal/status" className="font-semibold underline">
                  View renewal status
                </Link>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="renewal-passport-number"
              label="Current Passport Number"
              autoComplete="off"
              hint="From your member record"
              value={passportNumber}
              readOnly
            />

            <TextField
              id="renewal-expiry"
              label="Passport Expiry Date"
              hint="From your member record"
              value={formatDate(eligibility.expiry)}
              readOnly
            />
          </div>

          <SelectField
            id="renewal-reason"
            label="Reason for Renewal"
            required
            options={RENEWAL_REASONS}
            value={reason}
            error={errors.reason}
            onChange={(event) => {
              setReason(event.target.value);
              setErrors((current) => {
                if (!current.reason) return current;
                const next = { ...current };
                delete next.reason;
                return next;
              });
            }}
          />

          <fieldset>
            <legend className="flex items-center gap-1 text-sm font-semibold text-ink">
              Processing Type
              <span className="text-danger" aria-hidden="true">
                *
              </span>
            </legend>

            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {PROCESSING_TYPES.map((type) => {
                const checked = processing === type.value;
                return (
                  <label
                    key={type.value}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-card border p-4 transition-colors focus-within:ring-4 focus-within:ring-brand/10",
                      checked
                        ? "border-brand bg-tint ring-2 ring-brand/10"
                        : "border-line bg-white hover:border-brand/60",
                    )}
                  >
                    <input
                      type="radio"
                      name="renewal-processing"
                      value={type.value}
                      checked={checked}
                      onChange={() => setProcessing(type.value)}
                      className="mt-1 h-[18px] w-[18px] shrink-0 accent-brand"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-ink">
                          {type.label} Processing
                        </span>
                        <span className="text-sm font-bold text-brand">{type.fee}</span>
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">{type.days}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <NoteStrip>
            A passport can be renewed inside the six months before it expires. Lost or
            damaged passports follow a separate process.
          </NoteStrip>

          {expired ? (
            <div className="flex items-start gap-2.5 rounded-control border border-[#fde68a] bg-amber-bg px-4 py-3 text-sm leading-relaxed text-amber-ink">
              <Icon name="alert-circle" size={17} className="mt-0.5 shrink-0" />
              <span>
                This passport expired on {formatDate(eligibility.expiry)}. You can still renew,
                but the consular office may ask for additional supporting documents.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-control border border-[#bbf7d0] bg-green-bg px-4 py-3 text-sm leading-relaxed text-green-ink">
              <Icon name="check-circle" size={17} className="mt-0.5 shrink-0" />
              <span>
                Your passport expires on {formatDate(eligibility.expiry)}. You are inside the
                six-month renewal window, so this passport is eligible for renewal.
              </span>
            </div>
          )}

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <ButtonLink to="/dashboard" variant="outline">
              Cancel
            </ButtonLink>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </RenewalCard>
    </RenewalShell>
  );
}
