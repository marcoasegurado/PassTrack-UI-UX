import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RequirementRail } from "../../components/renewal/RequirementRail";
import { NoteStrip, RenewalCard, RenewalShell, RENEWAL_STEPS } from "../../components/renewal/RenewalShell";
import { Button, ButtonLink } from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../data/StoreProvider";
import { PROCESSING_TYPES, RENEWAL_REASONS, RENEWAL_STATUS, RENEWAL_STATUS_LABELS } from "../../lib/constants";
import { cn } from "../../lib/cn";
import { validateRequiredFields } from "../../lib/validation";
import { usePageTitle } from "../../lib/usePageTitle";

const SIX_MONTHS = 183 * 24 * 60 * 60 * 1000;

export function RenewalEligibility() {
  const navigate = useNavigate();
  const { state, member, latestRenewal, saveRenewalDraft } = useStore();
  const draft = state.renewalDraft || {};

  const [passportNumber, setPassportNumber] = useState(
    draft.passportNumber || member?.passport?.number || "",
  );
  const [expiry, setExpiry] = useState(draft.expiry || member?.passport?.expiry || "");
  const [reason, setReason] = useState(draft.reason || RENEWAL_REASONS[0]);
  const [processing, setProcessing] = useState(draft.processing || "Regular");
  const [errors, setErrors] = useState({});

  usePageTitle("Passport Renewal · Eligibility");

  const expiryDate = expiry ? new Date(expiry) : null;
  const validExpiry = expiryDate && !Number.isNaN(expiryDate.getTime());
  const expired = validExpiry && expiryDate.getTime() < Date.now();
  const withinWindow =
    validExpiry && !expired && expiryDate.getTime() - Date.now() <= SIX_MONTHS;

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRequiredFields({
      passportNumber: { value: passportNumber, label: "Current Passport Number" },
      expiry: { value: expiry, label: "Passport Expiry Date", type: "date" },
      reason: { value: reason, label: "Reason for Renewal" },
    });

    if (
      !nextErrors.passportNumber &&
      !/^[A-Z0-9-]{6,15}$/i.test(passportNumber.trim())
    ) {
      nextErrors.passportNumber =
        "Enter a valid passport number (6–15 letters, numbers, or hyphens).";
    }

    if (!nextErrors.expiry) {
      const latest = new Date();
      latest.setFullYear(latest.getFullYear() + 10);
      if (expiryDate > latest) {
        nextErrors.expiry = "Enter a valid passport expiry date.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document
        .getElementById(nextErrors.passportNumber ? "renewal-passport-number" : "renewal-expiry")
        ?.focus();
      return;
    }

    saveRenewalDraft({
      passportNumber: passportNumber.trim().toUpperCase(),
      expiry,
      reason,
      processing,
    });

    navigate("/renewal/personal-details");
  }

  return (
    <RenewalShell
      title="Passport Renewal"
      description="Renew your passport in a few simple steps."
      rail={<RequirementRail processing={processing} />}
    >
      <RenewalCard
        title="Eligibility Check"
        subtitle="Tell us about your current passport to start your renewal."
      >
        <Stepper steps={RENEWAL_STEPS} current={1} className="mb-6" />

        {latestRenewal && (
          <div
            className={cn(
              "mb-6 flex items-start gap-3 rounded-control border px-4 py-3 text-sm leading-relaxed",
              latestRenewal.status === RENEWAL_STATUS.REJECTED
                ? "border-[#fecdd3] bg-rose-bg text-rose-ink"
                : "border-[#cfe0fa] bg-tint text-slate-body",
            )}
          >
            <Icon
              name={latestRenewal.status === RENEWAL_STATUS.REJECTED ? "alert-circle" : "info"}
              size={17}
              className="mt-0.5 shrink-0"
            />
            <div>
              <p className="font-semibold text-ink">
                {latestRenewal.status === RENEWAL_STATUS.REJECTED
                  ? "Your last renewal request was rejected."
                  : `You already have a renewal request on file (${latestRenewal.ref}).`}
              </p>
              <p className="mt-0.5 text-xs">
                {latestRenewal.status === RENEWAL_STATUS.REJECTED
                  ? "You can submit a corrected request below."
                  : `Current status: ${RENEWAL_STATUS_LABELS[latestRenewal.status]}.`}{" "}
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
              required
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="Enter your passport number"
              value={passportNumber}
              error={errors.passportNumber}
              onChange={(event) => {
                setPassportNumber(event.target.value.toUpperCase());
                setErrors((current) => {
                  if (!current.passportNumber) return current;
                  const next = { ...current };
                  delete next.passportNumber;
                  return next;
                });
              }}
            />

            <TextField
              id="renewal-expiry"
              label="Passport Expiry Date"
              required
              type="date"
              value={expiry}
              error={errors.expiry}
              onChange={(event) => {
                setExpiry(event.target.value);
                setErrors((current) => {
                  if (!current.expiry) return current;
                  const next = { ...current };
                  delete next.expiry;
                  return next;
                });
              }}
            />
          </div>

          <SelectField
            id="renewal-reason"
            label="Reason for Renewal"
            required
            options={RENEWAL_REASONS}
            value={reason}
            error={errors.reason}
            onChange={(event) => setReason(event.target.value)}
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
                      "flex cursor-pointer gap-3 rounded-card border p-4 transition focus-within:ring-4 focus-within:ring-brand/10",
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
            You can renew your passport up to 6 months before it expires. Lost or damaged
            passports follow a separate process.
          </NoteStrip>

          {expired && (
            <div className="flex items-start gap-2.5 rounded-control border border-[#fde68a] bg-amber-bg px-4 py-3 text-sm leading-relaxed text-amber-ink">
              <Icon name="alert-circle" size={17} className="mt-0.5 shrink-0" />
              <span>
                This passport has already expired. You can still renew, but the consular
                office may ask for additional supporting documents.
              </span>
            </div>
          )}

          {withinWindow && (
            <div className="flex items-start gap-2.5 rounded-control border border-[#bbf7d0] bg-green-bg px-4 py-3 text-sm leading-relaxed text-green-ink">
              <Icon name="check-circle" size={17} className="mt-0.5 shrink-0" />
              <span>
                You are within the six-month renewal window, so this passport is eligible for
                renewal.
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
