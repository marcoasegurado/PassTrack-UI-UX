import { ButtonLink } from "../ui/Button";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">Page not found</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        This route is not part of the PASSTRACK demo yet, or the link is incorrect.
      </p>
      <ButtonLink to="/" className="mt-6">
        Return to login
      </ButtonLink>
    </div>
  );
}
