import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { Icon } from "../../components/ui/Icon";
import { useStore } from "../../data/StoreProvider";
import { usePageTitle } from "../../lib/usePageTitle";

export function AdminLogin() {
  const navigate = useNavigate();
  const { isAdminLoggedIn, loginAdmin } = useStore();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("demo-admin");
  const [error, setError] = useState("");

  usePageTitle("Admin Login");

  if (isAdminLoggedIn) return <Navigate to="/admin/dashboard" replace />;

  function submit(event) {
    event.preventDefault();
    const result = loginAdmin(username, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/admin/dashboard", { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fc] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <img
            src="/assets/logo-mark.svg"
            alt=""
            width="80"
            height="80"
            className="mx-auto h-20 w-20 object-contain"
          />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">PASSTRACK</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Administrator Sign In</h1>
          <p className="mt-1 text-sm text-muted">Manage applications, renewals, and member inquiries.</p>
        </div>

        <section className="rounded-panel border border-line bg-surface p-6 shadow-card sm:p-8">
          {error && (
            <div role="alert" className="mb-5 flex items-start gap-2 rounded-control border border-[#f9c2c2] bg-[#fff6f6] px-4 py-3 text-sm text-danger">
              <Icon name="alert-circle" size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <TextField id="admin-username" label="Username" required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
            <TextField id="admin-password" label="Password" required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <Button type="submit" block>Sign in</Button>
          </form>
        </section>
        <div className="mt-4 flex justify-center">
          <Link
            to="/login"
            className="inline-flex min-h-6 items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-brand"
          >
            <Icon name="arrow-left" size={13} />
            Back to member portal
          </Link>
        </div>
      </div>
    </main>
  );
}
