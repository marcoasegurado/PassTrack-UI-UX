import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Button } from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import { Stepper } from "../../components/ui/Stepper";
import { useStore } from "../../data/StoreProvider";
import { hasErrors, validateRequiredFields } from "../../lib/validation";
import { usePageTitle } from "../../lib/usePageTitle";

const STEPS = ["Personal Details", "ID Details", "Create Account"];

function localPhone(value = "") {
  return String(value).replace(/^\+63\s?/, "").replace(/\D/g, "").slice(0, 10);
}

export function RegisterPersonal() {
  const navigate = useNavigate();
  const { state, saveRegistrationDraft } = useStore();
  const draft = state.registrationDraft.personal || {};

  const [form, setForm] = useState({
    firstName: draft.firstName || "",
    middleName: draft.middleName || "",
    lastName: draft.lastName || "",
    birthday: draft.birthday || "",
    contact: localPhone(draft.contact),
    email: draft.email || "",
    sex: draft.sex || "",
    civilStatus: draft.civilStatus || "",
    birthplace: draft.birthplace || "",
    citizenship: draft.citizenship || "",
  });
  const [errors, setErrors] = useState({});

  usePageTitle("Registration · Personal Details");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRequiredFields({
      firstName: { value: form.firstName, label: "First Name" },
      lastName: { value: form.lastName, label: "Last Name" },
      birthday: { value: form.birthday, label: "Birthday", type: "date" },
      contact: { value: form.contact, label: "Contact Number", type: "phone" },
      email: { value: form.email, label: "Email Address", type: "email" },
      sex: { value: form.sex, label: "Sex" },
      civilStatus: { value: form.civilStatus, label: "Civil Status" },
      birthplace: { value: form.birthplace, label: "Place of Birth" },
      citizenship: { value: form.citizenship, label: "Citizenship" },
    });

    if (!nextErrors.birthday && form.birthday) {
      const birthday = new Date(form.birthday);
      const oldest = new Date();
      oldest.setFullYear(oldest.getFullYear() - 120);

      if (birthday.getTime() > Date.now()) {
        nextErrors.birthday = "Birthday cannot be in the future.";
      } else if (birthday < oldest) {
        nextErrors.birthday = "Enter a valid birthday.";
      }
    }

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`personal-${first}`)?.focus();
      return;
    }

    saveRegistrationDraft({
      personal: {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        birthday: form.birthday,
        contact: `+63 ${form.contact.replace(/\D/g, "")}`,
        email: form.email.trim(),
        sex: form.sex,
        civilStatus: form.civilStatus,
        birthplace: form.birthplace.trim(),
        citizenship: form.citizenship,
      },
    });

    navigate("/register/id-details");
  }

  return (
    <AuthShell
      context="Registration · Personal Details"
      actions={[{ label: "Back to Login", to: "/login" }]}
    >
      <div className="w-full max-w-[720px] overflow-hidden rounded-panel border border-line bg-white shadow-card">
        <header className="border-b border-line-soft px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-bold leading-tight text-navy sm:text-3xl">
            Personal Details
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted sm:text-[15px]">
            Tell us about yourself to start your passport application.
          </p>
        </header>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <Stepper steps={STEPS} current={1} className="mb-6" />

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
            <TextField
              id="personal-firstName"
              label="First Name"
              required
              autoComplete="given-name"
              placeholder="Enter your first name"
              value={form.firstName}
              error={errors.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />

            <TextField
              id="personal-middleName"
              label="Middle Name"
              autoComplete="additional-name"
              placeholder="Enter your middle name"
              hint="Optional. Use the name on your supporting ID."
              value={form.middleName}
              error={errors.middleName}
              onChange={(event) => update("middleName", event.target.value)}
            />

            <TextField
              id="personal-lastName"
              label="Last Name"
              required
              autoComplete="family-name"
              placeholder="Enter your last name"
              value={form.lastName}
              error={errors.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />

            <TextField
              id="personal-birthday"
              label="Birthday"
              required
              type="date"
              autoComplete="bday"
              max={new Date().toISOString().slice(0, 10)}
              value={form.birthday}
              error={errors.birthday}
              onChange={(event) => update("birthday", event.target.value)}
            />

            <TextField
              id="personal-contact"
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
              onChange={(event) => update("contact", event.target.value.replace(/\D/g, ""))}
            />

            <TextField
              id="personal-email"
              label="Email Address"
              required
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={(event) => update("email", event.target.value)}
            />

            <SelectField
              id="personal-sex"
              label="Sex"
              required
              placeholder="Select your sex"
              options={["Male", "Female"]}
              value={form.sex}
              error={errors.sex}
              onChange={(event) => update("sex", event.target.value)}
            />

            <SelectField
              id="personal-civilStatus"
              label="Civil Status"
              required
              placeholder="Select your civil status"
              options={["Single", "Married", "Widowed", "Separated"]}
              value={form.civilStatus}
              error={errors.civilStatus}
              onChange={(event) => update("civilStatus", event.target.value)}
            />

            <TextField
              id="personal-birthplace"
              label="Place of Birth"
              required
              placeholder="Enter your place of birth"
              value={form.birthplace}
              error={errors.birthplace}
              onChange={(event) => update("birthplace", event.target.value)}
            />

            <SelectField
              id="personal-citizenship"
              label="Citizenship"
              required
              placeholder="Select your citizenship"
              options={["Filipino", "Dual Citizen", "Foreign National"]}
              value={form.citizenship}
              error={errors.citizenship}
              onChange={(event) => update("citizenship", event.target.value)}
            />

            <div className="flex justify-end pt-1">
              <Button type="submit">Next</Button>
            </div>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
