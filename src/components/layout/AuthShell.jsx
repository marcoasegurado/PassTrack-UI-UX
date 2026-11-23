import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";
import { cn } from "../../lib/cn";

export function AuthShell({ context, actions = [], children, className }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-page">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(180,208,255,.55),rgba(244,248,255,0)_70%)] blur-[40px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(190,216,255,.5),rgba(244,248,255,0)_70%)] blur-[40px]"
      />

      <AppHeader context={context} homeTo="/login" actions={actions} />

      <main
        className={cn(
          "relative z-10 flex flex-1 justify-center px-4 pb-16 pt-8 sm:px-6 lg:pt-14",
          className,
        )}
      >
        {children}
      </main>

      <Footer bare />
    </div>
  );
}
