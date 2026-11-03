"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-neutral-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[92vh] w-full animate-pop-in overflow-y-auto rounded-t-2xl bg-white shadow-2xl outline-none sm:max-w-[520px] sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-7 pt-7">
          <div>
            <h2 className="text-h3 font-semibold text-neutral-900">{title}</h2>
            {subtitle && <p className="text-body text-neutral-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-7 pt-5 pb-7">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 px-7 py-5 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
