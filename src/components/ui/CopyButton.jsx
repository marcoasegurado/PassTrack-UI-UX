import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

function fallbackCopy(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } catch {
    // Clipboard access can be blocked; the label still confirms the attempt.
  }
  document.body.removeChild(textarea);
}

export function CopyButton({ value, label = "Copy", className, compact = false }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        fallbackCopy(value);
      }
    } catch {
      fallbackCopy(value);
    }
    setCopied(true);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-control border border-line bg-white font-semibold text-muted transition hover:border-brand hover:text-brand",
        compact ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
        className,
      )}
    >
      <Icon name={copied ? "check" : "copy"} size={15} />
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
