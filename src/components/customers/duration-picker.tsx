"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { calcExpiry, durationLabel, fmtDate } from "@/lib/subscription";
import { DURATIONS, type Duration } from "@/lib/types";

/** 3 / 6 / 12 months option cards. If `startDate` is given, shows "Ends …" under each. */
export function DurationPicker({
  value,
  onChange,
  startDate,
  compact,
}: {
  value: Duration;
  onChange: (d: Duration) => void;
  startDate?: string;
  compact?: boolean;
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-3">
      {DURATIONS.map((d) => {
        const on = d === value;
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(d)}
            className={cn(
              "relative flex flex-col items-start rounded-xl border px-4 text-left transition",
              compact ? "py-3" : "py-3.5",
              on
                ? "border-primary-600 bg-primary-50 ring-4 ring-primary-100"
                : "border-neutral-200 bg-white hover:border-neutral-400/70",
            )}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-[18px] items-center justify-center rounded-full border",
                  on ? "border-primary-600 bg-primary-600 text-white" : "border-neutral-400 bg-white",
                )}
              >
                {on && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className={cn("text-body font-semibold", on ? "text-primary-700" : "text-neutral-900")}>
                {durationLabel(d)}
              </span>
            </span>
            {startDate && (
              <span className="mt-1 pl-[28px] text-caption text-neutral-500">Ends {fmtDate(calcExpiry(startDate, d))}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
