"use client";

import { Mail, Pencil, Phone, RefreshCw, Send, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCustomerActions } from "@/components/customers/actions-provider";
import { NotFoundCustomer } from "@/components/customers/not-found";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { daysLeft, durationLabel, fmtDate, remainingLabel } from "@/lib/subscription";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { differenceInCalendarDays, parseISO } from "date-fns";

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCustomer, statusOf } = useStore();
  const { open } = useCustomerActions();
  const c = getCustomer(id);
  if (!c) return <NotFoundCustomer />;

  const status = statusOf(c);
  const total = Math.max(1, differenceInCalendarDays(parseISO(c.expiresAt), parseISO(c.startDate)));
  const left = daysLeft(c.expiresAt);
  const used = Math.min(100, Math.max(0, ((total - left) / total) * 100));
  const history = [...c.renewals].reverse();

  return (
    <>
      <Link href="/customers" className="mb-3 inline-flex items-center gap-1 text-body font-medium text-neutral-500 hover:text-primary-600">
        <ChevronLeft className="size-[18px]" /> Customers
      </Link>

      <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={c.fullName} size={56} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-[24px] leading-8 font-semibold sm:text-h1">{c.fullName}</h1>
              <StatusBadge status={status} expiresAt={c.expiresAt} withLabel />
            </div>
            <p className="mt-1 text-body text-neutral-500">Customer since {fmtDate(c.createdAt)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <ButtonLink href={`/customers/${c.id}/edit`} variant="secondary" icon={<Pencil className="size-[18px]" />}>
            Edit
          </ButtonLink>
          <Button variant="soft" icon={<Send className="size-[18px]" />} onClick={() => open("reminder", c.id)}>
            Send Reminder
          </Button>
          <Button className="col-span-2" icon={<RefreshCw className="size-[18px]" />} onClick={() => open("renew", c.id)}>
            Renew Subscription
          </Button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,700px)_380px]">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Subscription" subtitle="Current plan details" />
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["Start date", fmtDate(c.startDate)],
                  ["Duration", durationLabel(c.durationMonths)],
                  ["Expiration date", fmtDate(c.expiresAt)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-neutral-25 px-4 py-3">
                    <p className="text-caption text-neutral-500">{k}</p>
                    <p className="text-body font-semibold text-neutral-900">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-label font-medium text-neutral-700">Time remaining</span>
                  <span
                    className={cn(
                      "text-label font-semibold",
                      status === "active" && "text-success-600",
                      status === "expiring" && "text-warning-700",
                      status === "expired" && "text-danger-600",
                    )}
                  >
                    {remainingLabel(c.expiresAt)}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      status === "active" && "bg-success-600",
                      status === "expiring" && "bg-warning-600",
                      status === "expired" && "bg-danger-600",
                    )}
                    style={{ width: `${status === "expired" ? 100 : used}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-caption text-neutral-500">
                  <span>{fmtDate(c.startDate)}</span>
                  <span>{fmtDate(c.expiresAt)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Renewal history" subtitle="Every time this subscription was renewed" />
            <ol className="px-6 pb-6">
              {history.map((r, i) => (
                <li key={r.id} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < history.length - 1 && <span className="absolute top-6 left-[9px] h-full w-px bg-neutral-200" />}
                  <span
                    className={cn(
                      "relative mt-1 size-[19px] shrink-0 rounded-full border-4",
                      i === 0 ? "border-primary-100 bg-primary-600" : "border-neutral-100 bg-neutral-400",
                    )}
                  />
                  <div>
                    <p className="text-body font-medium text-neutral-900">
                      {r.type === "initial" ? `First subscription · ${durationLabel(r.durationMonths)}` : `Renewed for ${durationLabel(r.durationMonths)}`}
                    </p>
                    <p className="text-caption text-neutral-500">
                      {fmtDate(r.periodStart)} → {fmtDate(r.periodEnd)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Contact" />
            <div className="space-y-4 px-6 pb-6">
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 group">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Phone className="size-[18px]" />
                </span>
                <span>
                  <span className="block text-caption text-neutral-500">Phone</span>
                  <span className="text-body font-medium text-neutral-900 group-hover:text-primary-600">{c.phone}</span>
                </span>
              </a>
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Mail className="size-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-caption text-neutral-500">Email</span>
                  {c.email ? (
                    <a href={`mailto:${c.email}`} className="block truncate text-body font-medium text-neutral-900 hover:text-primary-600">
                      {c.email}
                    </a>
                  ) : (
                    <span className="text-body text-neutral-400">Not added</span>
                  )}
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-danger-50 p-6">
            <h3 className="text-h3 font-semibold text-neutral-900">Delete customer</h3>
            <p className="mt-2 text-body text-neutral-500">
              Removes this customer and their subscription records. This cannot be undone.
            </p>
            <Button
              variant="secondary"
              className="mt-4 text-danger-600 hover:border-danger-600/40 hover:bg-danger-50"
              icon={<Trash2 className="size-[18px]" />}
              onClick={() => open("delete", c.id, { onDeleted: () => router.push("/customers") })}
            >
              Delete customer
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
