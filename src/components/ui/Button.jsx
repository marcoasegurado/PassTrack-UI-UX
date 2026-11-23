import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

const VARIANTS = {
  primary:
    "border-brand bg-brand text-white hover:bg-brand-strong hover:border-brand-strong",
  outline:
    "border-brand bg-white text-brand hover:bg-[#f3f7ff]",
  ghost:
    "border-line bg-white text-ink hover:bg-surface-muted",
  danger:
    "border-danger bg-danger text-white hover:bg-[#b91c1c] hover:border-[#b91c1c]",
  dangerGhost:
    "border-line bg-white text-danger hover:bg-rose-bg",
};

const SIZES = {
  sm: "h-9 min-h-9 px-4 text-sm",
  md: "h-11 min-h-11 px-5 text-sm",
  lg: "h-14 min-h-14 px-6 text-lg",
  pill: "h-9 min-h-9 px-5 text-xs font-bold uppercase tracking-[0.12px] shadow-pill",
};

export function buttonClasses({ variant = "primary", size = "md", block = false, className } = {}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn border border-transparent font-semibold leading-none whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:border-[#dbe7fb] disabled:bg-[#dbe7fb] disabled:text-[#3f74dd] disabled:shadow-none",
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    block && "w-full",
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  className,
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  to,
  href,
  variant = "primary",
  size = "md",
  block = false,
  className,
  children,
  ...props
}) {
  const classes = buttonClasses({ variant, size, block, className });

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}
