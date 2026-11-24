import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RequirementRail } from "../../components/renewal/RequirementRail";
import { NoteStrip, RenewalCard, RenewalShell, RENEWAL_STEPS } from "../../components/renewal/RenewalShell";
import { Button } from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import { FileUploadField } from "../../components/ui/FileUploadField";
import { Icon } from "../../components/ui/Icon";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../data/StoreProvider";
import { APPOINTMENT_BRANCHES, APPOINTMENT_TIMES } from "../../lib/constants";
import { cn } from "../../lib/cn";
import { formatFileSize } from "../../lib/files";
import { isFutureDate, validateRequiredFields } from "../../lib/validation";
import { usePageTitle } from "../../lib/usePageTitle";

function tomorrow() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function RenewalDocumentsAppointment() {
  const navigate = useNavigate();
  const { state, saveRenewalDraft } = useStore();
  const draft = state.renewalDraft || {};
  const personal = draft.personal || {};
  const savedDocs = draft.documents || {};
  const savedAppointment = draft.appointment || {};

  const [passportCopy, setPassportCopy] = useState(savedDocs.passportCopy || null);
  const [governmentId, setGovernmentId] = useState(savedDocs.governmentId || null);
  const [supporting, setSupporting] = useState(savedDocs.supporting || []);
  const [branch, setBranch] = useState(savedAppointment.branch || APPOINTMENT_BRANCHES[0]);
  const [date, setDate] = useState(savedAppointment.date || "");
  const [time, setTime] = useState(savedAppointment.time || APPOINTMENT_TIMES[1]);
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({});

  usePageTitle("Passport Renewal · Documents & Appointment");

  if (!draft.passportNumber) {
    return <Navigate to="/renewal/eligibility" replace />;
  }

  if (!personal.firstName) {
    return <Navigate to="/renewal/personal-details" replace />;
  }

  function persist() {
    saveRenewalDraft({
      documents: { passportCopy, governmentId, supporting },
      appointment: { branch, date, time },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRequiredFields({
      branch: { value: branch, label: "Preferred Branch" },
      date: { value: date, label: "Preferred Date" },
      time: { value: time, label: "Preferred Time" },
    });

    if (!nextErrors.date && !isFutureDate(date)) {
      nextErrors.date = "Choose an appointment date in the future.";
    }

    const nextFileErrors = {};
    if (!passportCopy) {
      nextFileErrors.passportCopy = "Upload a copy of your current passport.";
    }
    if (!governmentId) {
      nextFileErrors.governmentId = "Upload one valid government-issued ID.";
    }

    if (Object.keys(nextErrors).length > 0 || Object.keys(nextFileErrors).length > 0) {
      setErrors(nextErrors);
      setFileErrors(nextFileErrors);
      document
        .getElementById(
          nextErrors.date
            ? "renewal-appointment-date"
            : nextErrors.branch
              ? "renewal-branch"
              : "renewal-passport-copy",
        )
        ?.focus();
      return;
    }

    persist();
    navigate("/renewal/review");
  }

  return (
    <RenewalShell
      title="Passport Renewal"
      description="Renew your passport in a few simple steps."
      rail={<RequirementRail processing={draft.processing} />}
    >
      <RenewalCard
        title="Documents & Appointment"
        subtitle="Upload your documents and choose when to visit."
      >
        <Stepper steps={RENEWAL_STEPS} current={3} className="mb-6" />

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <FileUploadField
              id="renewal-passport-copy"
              label="Current Passport Copy"
              required
              value={passportCopy}
              error={fileErrors.passportCopy}
              onError={(message) =>
                setFileErrors((current) => ({ ...current, passportCopy: message }))
              }
              onChange={(file) => {
                setPassportCopy(file);
                setFileErrors((current) => ({ ...current, passportCopy: "" }));
              }}
              hint="JPG, PNG, or PDF up to 10 MB. The data page must be readable."
            />

            <FileUploadField
              id="renewal-government-id"
              label="Valid Government ID"
              required
              value={governmentId}
              error={fileErrors.governmentId}
              onError={(message) =>
                setFileErrors((current) => ({ ...current, governmentId: message }))
              }
              onChange={(file) => {
                setGovernmentId(file);
                setFileErrors((current) => ({ ...current, governmentId: "" }));
              }}
              hint="JPG, PNG, or PDF up to 10 MB."
            />

            <div className="flex flex-col gap-3">
              <FileUploadField
                id="renewal-supporting"
                label="Supporting Documents"
                value={null}
                onChange={(file) => {
                  if (!file) return;
                  setSupporting((current) => [...current, file]);
                }}
                hint="Optional. Proof of name change or other supporting files, up to 10 MB each."
              />

              {supporting.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {supporting.map((file, index) => (
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
                          setSupporting((current) =>
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
          </div>

          <hr className="border-line-soft" />

          <div>
            <h3 className="text-lg font-bold text-navy">Appointment</h3>
            <p className="mt-1 text-sm text-muted">
              Choose where and when you&apos;d like to submit your documents in person.
            </p>

            <div className="mt-4 flex flex-col gap-5">
              <SelectField
                id="renewal-branch"
                label="Preferred Branch"
                required
                options={APPOINTMENT_BRANCHES}
                value={branch}
                error={errors.branch}
                onChange={(event) => {
                  setBranch(event.target.value);
                  setErrors((current) => {
                    if (!current.branch) return current;
                    const next = { ...current };
                    delete next.branch;
                    return next;
                  });
                }}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="renewal-appointment-date"
                  label="Preferred Date"
                  required
                  type="date"
                  min={tomorrow()}
                  value={date}
                  error={errors.date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setErrors((current) => {
                      if (!current.date) return current;
                      const next = { ...current };
                      delete next.date;
                      return next;
                    });
                  }}
                />

                <fieldset>
                  <legend className="flex items-center gap-1 text-sm font-semibold text-ink">
                    Preferred Time
                    <span className="text-danger" aria-hidden="true">
                      *
                    </span>
                  </legend>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {APPOINTMENT_TIMES.map((slot) => {
                      const checked = time === slot;
                      return (
                        <label
                          key={slot}
                          className={cn(
                            "flex h-11 cursor-pointer items-center justify-center rounded-control border text-sm font-semibold transition focus-within:ring-4 focus-within:ring-brand/10",
                            checked
                              ? "border-brand bg-tint text-brand ring-2 ring-brand/10"
                              : "border-line bg-white text-slate-body hover:border-brand/60",
                          )}
                        >
                          <input
                            type="radio"
                            name="renewal-appointment-time"
                            value={slot}
                            checked={checked}
                            onChange={() => setTime(slot)}
                            className="sr-only"
                          />
                          {slot}
                        </label>
                      );
                    })}
                  </div>
                  {errors.time && (
                    <p role="alert" className="mt-1.5 text-xs text-danger">
                      {errors.time}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>
          </div>

          <NoteStrip>
            Please arrive 15 minutes early and bring the original copies of the documents you
            uploaded.
          </NoteStrip>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                persist();
                navigate("/renewal/personal-details");
              }}
            >
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </RenewalCard>
    </RenewalShell>
  );
}
