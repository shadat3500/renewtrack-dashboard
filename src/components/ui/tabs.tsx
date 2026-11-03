import { cn } from "@/lib/cn";
import { CountPill } from "./badge";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-body font-medium transition-colors",
              active
                ? "border-primary-600 bg-primary-50 text-primary-700"
                : "border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900",
            )}
          >
            {t.label}
            {t.count !== undefined && <CountPill tone={active ? "primary" : "neutral"}>{t.count}</CountPill>}
          </button>
        );
      })}
    </div>
  );
}
