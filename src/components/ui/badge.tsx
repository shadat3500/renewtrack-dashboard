import { cn } from "@/lib/cn";
import { remainingLabel } from "@/lib/subscription";
import type { Status } from "@/lib/types";

const styles: Record<Status, { box: string; dot: string }> = {
  active: { box: "bg-success-50 text-success-600", dot: "bg-success-600" },
  expiring: { box: "bg-warning-50 text-warning-700", dot: "bg-warning-600" },
  expired: { box: "bg-danger-50 text-danger-600", dot: "bg-danger-600" },
};

export function Badge({ status, children, className }: { status: Status; children: React.ReactNode; className?: string }) {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center gap-1.5 rounded-full pl-2.5 pr-2.5 text-caption font-medium whitespace-nowrap",
        s.box,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {children}
    </span>
  );
}

/** Badge text for a customer, e.g. "Active · 92 days left" / "3 days left" / "Expired 2 days ago" */
export function StatusBadge({
  status,
  expiresAt,
  withLabel = false,
}: {
  status: Status;
  expiresAt: string;
  withLabel?: boolean;
}) {
  const remaining = remainingLabel(expiresAt);
  let text = remaining;
  if (withLabel) {
    if (status === "active") text = `Active · ${remaining}`;
    else if (status === "expiring") text = `Expiring · ${remaining}`;
  }
  return <Badge status={status}>{text}</Badge>;
}

export function CountPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "warning" | "danger" | "primary" }) {
  const t = {
    neutral: "bg-neutral-100 text-neutral-500",
    warning: "bg-warning-50 text-warning-700",
    danger: "bg-danger-50 text-danger-600",
    primary: "bg-primary-100 text-primary-700",
  }[tone];
  return (
    <span className={cn("inline-flex h-[22px] min-w-6 items-center justify-center rounded-full px-1.5 text-caption font-semibold", t)}>
      {children}
    </span>
  );
}
