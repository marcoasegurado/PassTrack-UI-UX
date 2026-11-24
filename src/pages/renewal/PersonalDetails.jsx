import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RequirementRail } from "../../components/renewal/RequirementRail";
import { RenewalCard, RenewalShell, RENEWAL_STEPS } from "../../components/renewal/RenewalShell";
import { Button } from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../data/StoreProvider";
import { validateRequiredFields } from "../../lib/validation";
import { usePageTitle } from "../../lib/usePageTitle";

const CIVIL_STATUSES = ["Single", "Married", "Widowed", "Separated"];
const CITIZENSHIPS = ["Filipino", "Dual Citizen", "Foreign National"];

function localPhone(value = "") {
  return String(value).replace(/^\+63\s?/, "").replace(/\D/g, "").slice(0, 10);
}

function internationalPhone(value = "") {
  const digits = String(value).replace(/\D/g, "").slice(0, 10);
  return digits ? `+63 ${digits}` : "";
}

export function RenewalPersonalDetails() {
  const navigate = useNavigate();
  const { state, member, saveRenewalDraft } = useStore();
  const draft = state.renewalDraft || {};
  const saved = draft.personal || {};

  const [form, setForm] = useState({
    firstName: saved.firstName ?? member?.firstName ?? "",
    middleName: saved.middleName ?? member?.middleName ?? "",
    lastName: saved.lastName ?? member?.lastName ?? "",
    dob: saved.dob ?? member?.birthday ?? "",
    sex: saved.sex ?? member?.sex ?? "",
    civilStatus: saved.civilStatus ?? member?.civilStatus ?? "",
    contact: localPhone(saved.contact ?? member?.contact ?? ""),
    email: saved.email ?? member?.email ?? "",
    address: saved.address ?? member?.address ?? "",
    city: saved.city ?? member?.city ?? "",
    province: saved.province ?? member?.province ?? "",
    postalCode: saved.postalCode ?? member?.postalCode ?? "",
    citizenship: saved.citizenship ?? member?.citizenship ?? "Filipino",
  });
  const [errors, setErrors] = useState({});

  usePageTitle("Passport Renewal · Personal Details");

  if (!draft.passportNumber) {
    return <Navigate to="/renewal/eligibility" replace />;
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function persist() {
    saveRenewalDraft({
      personal: {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        dob: form.dob,
        sex: form.sex,
        civilStatus: form.civilStatus,
        contact: internationalPhone(form.contact),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        postalCode: form.postalCode.trim(),
        citizenship: form.citizenship,
      },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRequiredFields({
      firstName: { value: form.firstName, label: "First Name" },
      lastName: { value: form.lastName, label: "Last Name" },
      dob: { value: form.dob, label: "Date of Birth", type: "date" },
      sex: { value: form.sex, label: "Sex" },
      civilStatus: { value: form.civilStatus, label: "Civil Status" },
      contact: { value: form.contact, label: "Contact Number", type: "phone" },
      email: { value: form.email, label: "Email Address", type: "email" },
      address: { value: form.address, label: "Home Address" },
      city: { value: form.city, label: "City" },
      province: { value: form.province, label: "Province" },
      postalCode: { value: form.postalCode, label: "Postal Code" },
      citizenship: { value: form.citizenship, label: "Citizenship" },
    });

    if (!nextErrors.postalCode && !/^\d{4}$/.test(form.postalCode.trim())) {
      nextErrors.postalCode = "Enter a 4-digit postal code.";
    }

    if (!nextErrors.contact && form.contact.replace(/\D/g, "").length !== 10) {
      nextErrors.contact = "Enter a 10-digit mobile number.";
    }

    if (!nextErrors.dob) {
      const dob = new Date(form.dob);
      const oldest = new Date();
      oldest.setFullYear(oldest.getFullYear() - 120);

      if (dob.getTime() > Date.now()) {
        nextErrors.dob = "Date of birth cannot be in the future.";
      } else if (dob < oldest) {
        nextErrors.dob = "Enter a valid date of birth.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`renewal-personal-${first}`)?.focus();
      return;
    }

    persist();
    navigate("/renewal/documents-appointment");
  }

  return (
    <RenewalShell
      title="Passport Renewal"
      description="Renew your passport in a few simple steps."
      rail={<RequirementRail processing={draft.processing} />}
    >
      <RenewalCard
        title="Personal Details"
        subtitle="Confirm your details exactly as they appear on your records."
      >
        <Stepper steps={RENEWAL_STEPS} current={2} className="mb-6" />

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              id="renewal-personal-firstName"
              label="First Name"
              required
              autoComplete="given-name"
              placeholder="Enter your first name"
              value={form.firstName}
              error={errors.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
            <TextField
              id="renewal-personal-middleName"
              label="Middle Name"
              autoComplete="additional-name"
              placeholder="Enter your middle name"
              hint="Optional"
              value={form.middleName}
              error={errors.middleName}
              onChange={(event) => update("middleName", event.target.value)}
            />
            <TextField
              id="renewal-personal-lastName"
              label="Last Name"
              required
              autoComplete="family-name"
              placeholder="Enter your last name"
              value={form.lastName}
              error={errors.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="renewal-personal-dob"
              label="Date of Birth"
              required
              type="date"
              autoComplete="bday"
              max={new Date().toISOString().slice(0, 10)}
              value={form.dob}
              error={errors.dob}
              onChange={(event) => update("dob", event.target.value)}
            />
            <SelectField
              id="renewal-personal-sex"
              label="Sex"
              required
              placeholder="Select your sex"
              options={["Male", "Female"]}
              value={form.sex}
              error={errors.sex}
              onChange={(event) => update("sex", event.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id="renewal-personal-civilStatus"
              label="Civil Status"
              required
              placeholder="Select your civil status"
              options={CIVIL_STATUSES}
              value={form.civilStatus}
              error={errors.civilStatus}
              onChange={(event) => update("civilStatus", event.target.value)}
            />
            <TextField
              id="renewal-personal-contact"
              label="Contact Number"
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              prefix="+63"
              placeholder="917 555 0101"
              maxLength={10}
              value={form.contact}
              error={errors.contact}
              onChange={(event) =>
                update("contact", event.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="renewal-personal-email"
              label="Email Address"
              required
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={(event) => update("email", event.target.value)}
            />
            <TextField
              id="renewal-personal-address"
              label="Home Address"
              required
              autoComplete="street-address"
              placeholder="Enter your street address"
              value={form.address}
              error={errors.address}
              onChange={(event) => update("address", event.target.value)}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              id="renewal-personal-city"
              label="City"
              required
              autoComplete="address-level2"
              placeholder="Enter your city"
              value={form.city}
              error={errors.city}
              onChange={(event) => update("city", event.target.value)}
            />
            <TextField
              id="renewal-personal-province"
              label="Province"
              required
              autoComplete="address-level1"
              placeholder="Enter your province"
              value={form.province}
              error={errors.province}
              onChange={(event) => update("province", event.target.value)}
            />
            <TextField
              id="renewal-personal-postalCode"
              label="Postal Code"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="1100"
              maxLength={4}
              value={form.postalCode}
              error={errors.postalCode}
              onChange={(event) =>
                update("postalCode", event.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <SelectField
            id="renewal-personal-citizenship"
            label="Citizenship"
            required
            options={CITIZENSHIPS}
            value={form.citizenship}
            error={errors.citizenship}
            onChange={(event) => update("citizenship", event.target.value)}
          />

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                persist();
                navigate("/renewal/eligibility");
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
