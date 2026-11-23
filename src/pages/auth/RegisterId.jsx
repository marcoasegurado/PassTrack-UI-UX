import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Button, ButtonLink } from "../../components/ui/Button";
import { FileUploadField } from "../../components/ui/FileUploadField";
import { SelectField, TextField } from "../../components/ui/Field";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../data/StoreProvider";
import { hasErrors, validateRequiredFields } from "../../lib/validation";
import { usePageTitle } from "../../lib/usePageTitle";

const STEPS = ["Personal Details", "ID Details", "Create Account"];

export function RegisterId() {
  const navigate = useNavigate();
  const { state, saveRegistrationDraft } = useStore();
  const personal = state.registrationDraft.personal || {};
  const draft = state.registrationDraft.idDetails || {};

  const [form, setForm] = useState({
    nationality: draft.nationality || "",
    address: draft.address || "",
    city: draft.city || "",
    province: draft.province || "",
    postalCode: draft.postalCode || "",
    motherMaidenName: draft.motherMaidenName || "",
    fatherFullName: draft.fatherFullName || "",
    idType: draft.idType || "",
  });
  const [validId, setValidId] = useState(draft.validId || null);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});

  usePageTitle("Registration · ID Details");

  if (!personal.firstName) {
    return <Navigate to="/register/personal-details" replace />;
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

  function handleFile(file) {
    setValidId(file);
    setFileError("");
    setErrors((current) => {
      if (!current.validId) return current;
      const next = { ...current };
      delete next.validId;
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRequiredFields({
      nationality: { value: form.nationality, label: "Nationality" },
      address: { value: form.address, label: "Address" },
      city: { value: form.city, label: "City" },
      province: { value: form.province, label: "Province" },
      postalCode: { value: form.postalCode, label: "Postal Code" },
      motherMaidenName: {
        value: form.motherMaidenName,
        label: "Mother's Maiden Name",
      },
      fatherFullName: { value: form.fatherFullName, label: "Father's Full Name" },
      idType: { value: form.idType, label: "Type of ID" },
    });

    if (!nextErrors.postalCode && !/^\d{4}$/.test(form.postalCode.trim())) {
      nextErrors.postalCode = "Enter a 4-digit postal code.";
    }

    if (!validId) {
      nextErrors.validId = "Upload a clear photo or scan of your valid ID.";
    }

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      document.getElementById(
        first === "validId" ? "register-valid-id" : `id-${first}`,
      )?.focus();
      return;
    }

    saveRegistrationDraft({
      idDetails: {
        nationality: form.nationality,
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        postalCode: form.postalCode.trim(),
        motherMaidenName: form.motherMaidenName.trim(),
        fatherFullName: form.fatherFullName.trim(),
        idType: form.idType,
        validId,
      },
    });

    navigate("/register/application");
  }

  return (
    <AuthShell
      context="Registration · ID Details"
      actions={[{ label: "Back to Login", to: "/login" }]}
    >
      <div className="w-full max-w-[720px] overflow-hidden rounded-panel border border-line bg-white shadow-card">
        <header className="border-b border-line-soft px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-bold leading-tight text-navy sm:text-3xl">
            ID Details
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted sm:text-[15px]">
            We use this to verify your identity.
          </p>
        </header>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <Stepper steps={STEPS} current={2} className="mb-6" />

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
            <SelectField
              id="id-nationality"
              label="Nationality"
              required
              placeholder="Select your nationality"
              options={[
                "Filipino",
                "American",
                "Australian",
                "British",
                "Canadian",
                "Japanese",
                "Other",
              ]}
              value={form.nationality}
              error={errors.nationality}
              onChange={(event) => update("nationality", event.target.value)}
            />

            <TextField
              id="id-address"
              label="Address"
              required
              autoComplete="street-address"
              placeholder="Enter your street address"
              value={form.address}
              error={errors.address}
              onChange={(event) => update("address", event.target.value)}
            />

            <TextField
              id="id-city"
              label="City"
              required
              autoComplete="address-level2"
              placeholder="Enter your city"
              value={form.city}
              error={errors.city}
              onChange={(event) => update("city", event.target.value)}
            />

            <TextField
              id="id-province"
              label="Province"
              required
              autoComplete="address-level1"
              placeholder="Enter your province"
              value={form.province}
              error={errors.province}
              onChange={(event) => update("province", event.target.value)}
            />

            <TextField
              id="id-postalCode"
              label="Postal Code"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Enter your postal code"
              maxLength={4}
              value={form.postalCode}
              error={errors.postalCode}
              onChange={(event) =>
                update("postalCode", event.target.value.replace(/\D/g, ""))
              }
            />

            <TextField
              id="id-motherMaidenName"
              label="Mother's Maiden Name"
              required
              placeholder="Enter your mother's maiden name"
              value={form.motherMaidenName}
              error={errors.motherMaidenName}
              onChange={(event) => update("motherMaidenName", event.target.value)}
            />

            <TextField
              id="id-fatherFullName"
              label="Father's Full Name"
              required
              placeholder="Enter your father's full name"
              value={form.fatherFullName}
              error={errors.fatherFullName}
              onChange={(event) => update("fatherFullName", event.target.value)}
            />

            <SelectField
              id="id-idType"
              label="Type of ID"
              required
              placeholder="Select your ID type"
              options={[
                "Driver's License",
                "Passport",
                "PhilSys National ID",
                "UMID",
                "Voter's ID",
              ]}
              value={form.idType}
              error={errors.idType}
              onChange={(event) => update("idType", event.target.value)}
            />

            <FileUploadField
              id="register-valid-id"
              label="Valid ID"
              required
              value={validId}
              onChange={handleFile}
              error={errors.validId || fileError}
              onError={setFileError}
              hint="JPG, PNG, or PDF up to 10 MB. Make sure the text is readable."
            />

            <div className="flex flex-wrap justify-between gap-3 pt-1">
              <ButtonLink to="/register/personal-details" variant="outline">
                Back
              </ButtonLink>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
