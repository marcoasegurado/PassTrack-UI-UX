import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "../../components/layout/AuthShell";
import { Button, ButtonLink } from "../../components/ui/Button";
import { CopyButton } from "../../components/ui/CopyButton";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import { useStore } from "../../data/StoreProvider";
import { DEMO_MEMBER_VARIANTS } from "../../data/seed";
import { formatDateTime } from "../../lib/format";
import { usePageTitle } from "../../lib/usePageTitle";

export function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const {
    state,
    isMemberLoggedIn,
    loginMember,
  } = useStore();

  const lastRegistration = state.lastRegistration;
  const stay = searchParams.get("stay") === "1";
  const requestedId = searchParams.get("id") || "";

  const [appId, setAppId] = useState(requestedId);
  const [password, setPassword] = useState(() =>
    requestedId && lastRegistration?.appId === requestedId
      ? lastRegistration.password
      : "",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showSavedPassword, setShowSavedPassword] = useState(false);
  const [error, setError] = useState("");
  const passwordRef = useRef(null);
  const appIdRef = useRef(null);

  usePageTitle("Member Login");

  if (isMemberLoggedIn && !stay) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!appId.trim()) {
      setError("Enter your Application ID and Password to continue.");
      appIdRef.current?.focus();
      return;
    }

    if (!password) {
      setError("Enter your Application ID and Password to continue.");
      passwordRef.current?.focus();
      return;
    }

    const result = loginMember(appId, password);

    if (!result.ok) {
      setError(result.error);
      passwordRef.current?.focus();
      passwordRef.current?.select();
      return;
    }

    toast(`Welcome back, ${result.member.firstName || result.member.name}.`);
    navigate("/dashboard");
  }

  function fillDemo(variant) {
    setAppId(variant.appId);
    setPassword(variant.password);
    setError("");
    toast(`${variant.label} demo account filled. Select Login to continue.`);
  }

  function useSavedCredentials() {
    setAppId(lastRegistration.appId);
    setPassword(lastRegistration.password);
    setError("");
    toast("Saved sign-in details filled.");
  }

  return (
    <AuthShell context="Member Login">
      <div className="w-full max-w-[656px]">
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-control border border-[#f9c2c2] bg-[#fff6f6] px-4 py-3 text-sm font-medium text-[#b42318]"
          >
            <Icon name="alert-circle" size={18} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-hidden rounded-panel border border-line bg-white shadow-card"
        >
          <div className="bg-[linear-gradient(90deg,#0b1f4b_0%,#1b46c8_60%,#1e4fd8_100%)] px-6 py-6 text-white sm:px-12">
            <h1 className="text-[28px] font-bold leading-tight sm:text-[32px]">Member Login</h1>
            <p className="mt-1 text-sm leading-relaxed text-white/90 sm:text-base">
              Enter your Application ID and Password to continue.
            </p>
          </div>

          <div className="space-y-5 px-6 py-7 sm:px-12 sm:py-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="login-app-id"
                className="text-xs font-bold uppercase tracking-[0.16em] text-brand"
              >
                Application ID
              </label>
              <div className="relative">
                <Icon
                  name="id-card"
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand/70"
                />
                <input
                  ref={appIdRef}
                  id="login-app-id"
                  name="appId"
                  type="text"
                  autoComplete="username"
                  spellCheck="false"
                  required
                  aria-invalid={error ? true : undefined}
                  placeholder="Enter your Application ID (e.g. PS-12345)"
                  value={appId}
                  onChange={(event) => {
                    setAppId(event.target.value.toUpperCase());
                    if (error) setError("");
                  }}
                  className="h-[58px] w-full rounded-full border border-transparent bg-page pl-12 pr-5 text-base text-ink outline-none transition placeholder:text-sm placeholder:text-[#6b6b6b]/80 focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="login-password"
                className="text-xs font-bold uppercase tracking-[0.16em] text-brand"
              >
                Password
              </label>
              <div className="relative">
                <Icon
                  name="lock"
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand/70"
                />
                <input
                  ref={passwordRef}
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  aria-invalid={error ? true : undefined}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  className="h-[58px] w-full rounded-full border border-transparent bg-page pl-12 pr-14 text-base text-ink outline-none transition placeholder:text-sm placeholder:text-[#6b6b6b]/80 focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-tint hover:text-brand"
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={19} />
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Button type="submit" size="lg" block>
                Login
              </Button>
            </div>

            <div className="space-y-3 border-t border-line-soft pt-4 text-center text-sm text-brand">
              <p>
                Don&rsquo;t have an application ID?{" "}
                <Link to="/register/personal-details" className="font-bold">
                  Register for a new passport
                </Link>
              </p>
              <p className="text-xs text-muted">
                Already registered? Use the Application ID and password from your
                confirmation screen.
              </p>
            </div>
          </div>
        </form>

        <div className="mt-4 flex justify-center">
          <Link
            to="/admin/login"
            className="inline-flex min-h-6 items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-brand"
          >
            <Icon name="shield" size={13} />
            Administrator Login
          </Link>
        </div>

        <section
          aria-label="Demo accounts"
          className="mt-5 rounded-card border border-dashed border-line bg-white/85 p-4"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Demo accounts · stored in this browser only
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {DEMO_MEMBER_VARIANTS.map((variant) => (
              <button
                key={variant.appId}
                type="button"
                onClick={() => fillDemo(variant)}
                className="cursor-pointer rounded-control border border-line bg-white px-3 py-2 text-left text-xs font-semibold text-ink transition hover:border-brand hover:bg-tint"
              >
                <span className="block text-brand">{variant.label}</span>
                <span className="mt-0.5 block font-mono text-[11px] font-normal text-muted">
                  {variant.appId}
                </span>
              </button>
            ))}
          </div>

          {lastRegistration && (
            <div className="mt-4 rounded-control border border-line bg-surface-muted p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-ink">Your saved sign-in details</p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Generated {formatDateTime(lastRegistration.at)} and saved on this device.
                  </p>
                </div>
                <span className="rounded-full bg-green-bg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-ink">
                  Saved
                </span>
              </div>

              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex items-center justify-between gap-2 rounded-control bg-white px-3 py-2">
                  <div className="min-w-0">
                    <dt className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Application ID
                    </dt>
                    <dd className="truncate font-mono text-sm font-semibold text-ink">
                      {lastRegistration.appId}
                    </dd>
                  </div>
                  <CopyButton value={lastRegistration.appId} compact label="Copy" />
                </div>

                <div className="flex items-center justify-between gap-2 rounded-control bg-white px-3 py-2">
                  <div className="min-w-0">
                    <dt className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Password
                    </dt>
                    <dd className="truncate font-mono text-sm font-semibold text-ink">
                      {showSavedPassword ? lastRegistration.password : "••••••••"}
                    </dd>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowSavedPassword((value) => !value)}
                      aria-label={
                        showSavedPassword ? "Hide saved password" : "Show saved password"
                      }
                      aria-pressed={showSavedPassword}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-control border border-line bg-white text-muted hover:border-brand hover:text-brand"
                    >
                      <Icon name={showSavedPassword ? "eye-off" : "eye"} size={15} />
                    </button>
                    <CopyButton value={lastRegistration.password} compact label="Copy" />
                  </div>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={useSavedCredentials}>
                  Use these details
                </Button>
                <ButtonLink to="/register/success" size="sm" variant="ghost">
                  View confirmation
                </ButtonLink>
              </div>
            </div>
          )}
        </section>
      </div>
    </AuthShell>
  );
}
