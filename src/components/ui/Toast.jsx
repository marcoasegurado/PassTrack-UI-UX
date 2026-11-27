import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const toast = useCallback((message) => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    setToasts((current) => [...current, { id, message, leaving: false }]);

    window.setTimeout(() => {
      setToasts((current) =>
        current.map((item) =>
          item.id === id ? { ...item, leaving: true } : item,
        ),
      );

      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 240);
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed right-4 top-4 z-[60] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:right-6 sm:top-6"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-2 rounded-control bg-navy px-4 py-2.5 text-sm text-white shadow-lg",
              item.leaving
                ? "motion-safe:animate-[pt-toast-out_0.24s_ease-in_forwards]"
                : "motion-safe:animate-[pt-toast-in_0.28s_cubic-bezier(0.22,1,0.36,1)]",
            )}
          >
            <Icon name="check-circle" size={16} />
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  return context || (() => {});
}
