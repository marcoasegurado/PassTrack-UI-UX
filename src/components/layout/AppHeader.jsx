import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";
import { Icon } from "../ui/Icon";

function ActionItem({ action, mobile = false, onNavigate }) {
  const className = mobile
    ? "flex w-full items-center gap-2 rounded-control px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10"
    : "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-control border border-white/25 bg-white/5 px-3.5 text-xs font-medium text-white transition hover:bg-white/15 hover:no-underline";

  const content = (
    <>
      {action.icon && <Icon name={action.icon} size={15} />}
      <span>{action.label}</span>
    </>
  );

  const handleClick = () => {
    action.onClick?.();
    onNavigate?.();
  };

  if (action.to) {
    return (
      <Link to={action.to} className={className} onClick={handleClick}>
        {content}
      </Link>
    );
  }

  if (action.href) {
    return (
      <a href={action.href} className={className} onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {content}
    </button>
  );
}

export function AppHeader({
  context,
  actions = [],
  homeTo = "/",
  onMenu,
  className,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const showMenuButton = Boolean(onMenu) || actions.length > 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-[84px] bg-[linear-gradient(90deg,#0b1f4b_0%,#1946c9_52%,#1e4fd8_100%)] sm:h-[106px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute left-[500px] top-0 hidden h-[106px] w-[620px] overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,#000_20%,#000_78%,transparent_100%)] lg:block">
        <img
          src="/assets/plane.jpeg"
          alt=""
          className="h-full w-full object-cover opacity-95"
        />
        <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,75,.35),rgba(25,70,201,.05)_55%,rgba(30,79,216,.28))]" />
      </div>

      <div className="shell relative z-10 flex h-full items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          to={homeTo}
          className="flex flex-none items-center gap-3 text-white hover:no-underline sm:gap-4"
        >
          <img
            src="/assets/logo-mark.png"
            alt=""
            className="h-[62px] w-[70px] object-contain sm:h-[82px] sm:w-[92px]"
          />
          <span>
            <span className="block text-xl font-bold leading-tight tracking-[0.2px] sm:text-[27px]">
              PASSTRACK
            </span>
            <span className="hidden text-[13px] font-normal leading-relaxed text-white/85 sm:block">
              Passport Application &amp; Tracking System
            </span>
          </span>
        </Link>

        {context && (
          <div className="hidden h-9 items-center border-l border-white/25 pl-5 text-[15px] font-medium text-white whitespace-nowrap lg:flex">
            {context}
          </div>
        )}

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {actions.map((action) => (
            <ActionItem key={action.label} action={action} />
          ))}
        </div>

        {showMenuButton && (
          <button
            type="button"
            onClick={() => (onMenu ? onMenu() : setMenuOpen((value) => !value))}
            aria-label={onMenu ? "Open navigation" : "Open account menu"}
            aria-expanded={onMenu ? undefined : menuOpen}
            className={cn(
              "ml-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-control border border-white/25 text-white hover:bg-white/15",
              onMenu ? "lg:hidden" : "md:hidden",
            )}
          >
            <Icon name="menu" size={20} />
          </button>
        )}
      </div>

      {menuOpen && actions.length > 0 && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-white/15 bg-navy p-3 shadow-xl md:hidden">
          <div className="flex flex-col gap-1">
            {actions.map((action) => (
              <ActionItem
                key={action.label}
                action={action}
                mobile
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
