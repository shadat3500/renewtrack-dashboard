"use client";

import { ChevronRight, MessageCircle, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { durationShort, fmtDate, fmtShort } from "@/lib/subscription";
import type { Customer } from "@/lib/types";
import { useCustomerActions } from "./actions-provider";

export type Column = "customer" | "phone" | "start" | "duration" | "expires" | "expiredOn" | "remaining" | "status" | "actions";

const HEAD: Record<Column, string> = {
  customer: "Customer",
  phone: "Phone",
  start: "Start date",
  duration: "Duration",
  expires: "Expires",
  expiredOn: "Expired on",
  remaining: "Remaining",
  status: "Status",
  actions: "Actions",
};

/** Row actions depend on status: expiring → Send Reminder, expired → Message + Renew, active → Renew. */
export function RowActions({ c, compact }: { c: Customer; compact?: boolean }) {
  const { statusOf } = useStore();
  const { open } = useCustomerActions();
  const s = statusOf(c);
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
  };
  return (
    <div className="flex items-center gap-2">
      {s === "expiring" && (
        <Button size="sm" variant="soft" icon={<Send className="size-4" />} onClick={stop(() => open("reminder", c.id))}>
          Send Reminder
        </Button>
      )}
      {s === "expired" && (
        <Button size="sm" variant="secondary" icon={<MessageCircle className="size-4" />} onClick={stop(() => open("reminder", c.id))}>
          Message
        </Button>
      )}
      {(s !== "expiring" || !compact) && (
        <Button
          size="sm"
          variant={s === "expired" ? "primary" : "secondary"}
          icon={<RefreshCw className="size-4" />}
          onClick={stop(() => open("renew", c.id))}
        >
          Renew
        </Button>
      )}
    </div>
  );
}

function Cell({ col, c, shortDates }: { col: Column; c: Customer; shortDates?: boolean }) {
  const { statusOf } = useStore();
  const s = statusOf(c);
  switch (col) {
    case "customer":
      return (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={c.fullName} />
          <div className="min-w-0">
            <p className="truncate text-body font-medium text-neutral-900">{c.fullName}</p>
            {c.email && <p className="truncate text-caption text-neutral-500">{c.email}</p>}
          </div>
        </div>
      );
    case "phone":
      return <span className="text-body text-neutral-700">{c.phone}</span>;
    case "start":
      return <span className="text-body text-neutral-700">{fmtDate(c.startDate)}</span>;
    case "duration":
      return <span className="text-body text-neutral-700">{durationShort(c.durationMonths)}</span>;
    case "expires":
      return <span className="text-body text-neutral-700">{shortDates ? fmtShort(c.expiresAt) : fmtDate(c.expiresAt)}</span>;
    case "expiredOn":
      return <span className="text-body text-neutral-700">{fmtDate(c.expiresAt)}</span>;
    case "remaining":
    case "status":
      return <StatusBadge status={s} expiresAt={c.expiresAt} />;
    case "actions":
      return <RowActions c={c} compact />;
  }
}

export function CustomerTable({
  customers,
  columns,
  className,
  shortDates,
}: {
  customers: Customer[];
  columns: Column[];
  className?: string;
  shortDates?: boolean;
}) {
  const router = useRouter();
  const { statusOf } = useStore();

  return (
    <div className={className}>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-y border-neutral-200 bg-neutral-25">
              {columns.map((col) => (
                <th key={col} scope="col" className="px-6 py-3 whitespace-nowrap text-caption font-semibold tracking-wide text-neutral-500 uppercase">
                  {HEAD[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/customers/${c.id}`)}
                className="cursor-pointer border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-25"
              >
                {columns.map((col) => (
                  <td key={col} className={cn("px-6 py-4", col === "customer" ? "max-w-[260px]" : "whitespace-nowrap")}>
                    <Cell col={col} c={c} shortDates={shortDates} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-neutral-100 md:hidden">
        {customers.map((c) => {
          const s = statusOf(c);
          return (
            <li key={c.id}>
              <Link href={`/customers/${c.id}`} className="flex items-center gap-3 px-4 py-4 active:bg-neutral-25">
                <Avatar name={c.fullName} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium text-neutral-900">{c.fullName}</p>
                  <p className="text-caption text-neutral-500">
                    {s === "expired" ? "Expired on" : "Expires"} {fmtDate(c.expiresAt)}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={s} expiresAt={c.expiresAt} />
                  </div>
                </div>
                <ChevronRight className="size-5 shrink-0 text-neutral-400" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
