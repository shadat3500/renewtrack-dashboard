"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/cn";

type Tone = "success" | "error";
interface Toast {
  id: number;
  tone: Tone;
  title: string;
  message?: string;
}

const ToastContext = createContext<(t: Omit<Toast, "id">) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((all) => [...all.slice(-2), { ...t, id }]);
    setTimeout(() => dismiss(id), 4000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:top-6 sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-[380px] animate-toast-in items-start gap-3 rounded-xl border bg-white p-4 shadow-lg",
              t.tone === "success" ? "border-success-50" : "border-danger-50",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                t.tone === "success" ? "bg-success-50 text-success-600" : "bg-danger-50 text-danger-600",
              )}
            >
              {t.tone === "success" ? <CheckCircle2 className="size-[18px]" /> : <AlertCircle className="size-[18px]" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold text-neutral-900">{t.title}</p>
              {t.message && <p className="text-label text-neutral-500">{t.message}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-neutral-400 hover:text-neutral-700">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
