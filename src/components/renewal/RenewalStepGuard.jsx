import { useStore } from "../../data/StoreProvider";
import { getRenewalEligibility } from "../../lib/renewalEligibility";
import { RenewalEligibilityNotice } from "./RenewalEligibilityNotice";
import { RenewalShell } from "./RenewalShell";

/**
 * Blocks the later renewal steps (personal details, documents, review) when
 * the active member is not eligible, including when the URL is typed directly.
 */
export function RenewalStepGuard({ children }) {
  const { member, latestRenewal } = useStore();
  const eligibility = getRenewalEligibility(member, latestRenewal);

  if (eligibility.allowed) return children;

  return (
    <RenewalShell
      title="Passport Renewal"
      description="Renew your passport in a few simple steps."
    >
      <RenewalEligibilityNotice eligibility={eligibility} />
    </RenewalShell>
  );
}
