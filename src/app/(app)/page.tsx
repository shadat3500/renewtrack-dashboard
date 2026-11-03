"use client";

import { AlertTriangle, CheckCircle2, Clock, MessageCircle, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCustomerActions } from "@/components/customers/actions-provider";
import { CustomerTable } from "@/components/customers/customer-table";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { fmtToday, fmtTodayShort, matchesSearch } from "@/lib/subscription";

export default function DashboardPage() {
  const { customers, counts, statusOf, settings } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const w = settings.expiringWindowDays;

  const expiring = useMemo(
    () => customers.filter((c) => statusOf(c) === "expiring").sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)),
    [customers, statusOf],
  );
  const expired = useMemo(
    () => customers.filter((c) => statusOf(c) === "expired").sort((a, b) => b.expiresAt.localeCompare(a.expiresAt)),
    [customers, statusOf],
  );
  const results = q.trim() ? customers.filter((c) => matchesSearch(c, q)).slice(0, 6) : [];
  const attention = counts.expiring + counts.expired;

  const stats = [
    { label: "Total customers", value: counts.total, hint: "All saved customers", icon: Users, tone: "bg-primary-50 text-primary-600", href: "/customers" },
    { label: "Active", value: counts.active, hint: `More than ${w} days left`, icon: CheckCircle2, tone: "bg-success-50 text-success-600", href: "/customers?status=active" },
    { label: "Expiring soon", value: counts.expiring, hint: `Within the next ${w} days`, icon: Clock, tone: "bg-warning-50 text-warning-600", href: "/expiring" },
    { label: "Expired", value: counts.expired, hint: "Follow up to renew", icon: AlertTriangle, tone: "bg-danger-50 text-danger-600", href: "/expired" },
  ];

  return (
    <>
      {/* Header — desktop */}
      <header className="mb-6 hidden items-center justify-between gap-4 lg:flex">
        <div>
          <h1 className="text-h1 font-semibold">Dashboard</h1>
          <p className="mt-1 text-body text-neutral-500">{fmtToday()} · Here is who needs your attention today</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-[300px]">
            <SearchInput value={q} onChange={setQ} />
            {q.trim() && (
              <div className="absolute inset-x-0 top-[52px] z-20 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
                {results.length === 0 ? (
                  <p className="px-4 py-3 text-body text-neutral-500">No customers match “{q}”.</p>
                ) : (
                  results.map((c) => (
                    <Link key={c.id} href={`/customers/${c.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-25">
                      <Avatar name={c.fullName} />
                      <span className="flex-1 truncate text-body font-medium">{c.fullName}</span>
                      <StatusBadge status={statusOf(c)} expiresAt={c.expiresAt} />
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          <ButtonLink href="/customers/new" icon={<Plus className="size-[18px]" />}>
            Add Customer
          </ButtonLink>
        </div>
      </header>

      {/* Header — mobile */}
      <header className="mb-5 flex items-center justify-between lg:hidden">
        <div>
          <p className="text-caption text-neutral-500">{fmtTodayShort()}</p>
          <h1 className="text-h1 font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/customers/new"
            aria-label="Add Customer"
            className="flex size-10 items-center justify-center rounded-[10px] bg-primary-600 text-white shadow-sm hover:bg-primary-700"
          >
            <Plus className="size-5" />
          </Link>
          <Avatar name={settings.ownerName} size={40} />
        </div>
      </header>

      {counts.total === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="size-7" />}
            title="No customers yet"
            message="Add your first customer to start tracking subscriptions and expiry dates."
            action={
              <ButtonLink href="/customers/new" icon={<Plus className="size-[18px]" />}>
                Add Customer
              </ButtonLink>
            }
          />
        </Card>
      ) : (
        <>
          {/* Attention banner */}
          {attention > 0 && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-warning-600/25 bg-warning-50 px-5 py-4 sm:flex-row sm:items-center">
              <AlertTriangle className="hidden size-5 shrink-0 text-warning-600 sm:block" />
              <p className="flex-1 text-body text-warning-700">
                <AlertTriangle className="mr-2 inline size-5 align-[-4px] text-warning-600 sm:hidden" />
                <span className="font-semibold">
                  {attention} customer{attention === 1 ? "" : "s"} need{attention === 1 ? "s" : ""} your attention
                </span>
                <span className="hidden sm:inline">
                  {" "}
                  — {counts.expiring} expire{counts.expiring === 1 ? "s" : ""} within {w} days and {counts.expired}{" "}
                  {counts.expired === 1 ? "has" : "have"} already expired.
                </span>
              </p>
              <Button variant="secondary" size="sm" className="w-full sm:w-auto" onClick={() => router.push(counts.expiring ? "/expiring" : "/expired")}>
                Review now
              </Button>
            </div>
          )}

          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-5 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                className={cn(
                  "rounded-2xl border border-neutral-200 bg-white p-3.5 transition hover:border-primary-100 hover:shadow-md sm:p-5",
                  i === 0 && "hidden lg:block",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={cn("hidden size-8 items-center justify-center rounded-lg sm:flex", s.tone)}>
                    <s.icon className="size-[18px]" />
                  </span>
                  <span className="order-last text-body font-medium text-neutral-700 sm:order-none">{s.label === "Expiring soon" ? <><span className="sm:hidden">Expiring</span><span className="hidden sm:inline">Expiring soon</span></> : s.label}</span>
                </div>
                <p className="mt-0 text-stat font-bold text-neutral-900 sm:mt-2.5">{s.value}</p>
                <p className="mt-1.5 hidden text-caption text-neutral-500 sm:block">{s.hint}</p>
              </Link>
            ))}
          </div>

          {/* Lists */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,700px)_minmax(0,1fr)]">
            <Card className="overflow-hidden">
              <CardHeader
                title="Expiring Soon"
                subtitle="Sorted by days left"
                action={
                  expiring.length > 0 && (
                    <Link href="/expiring" className="text-body font-medium text-primary-600 hover:text-primary-700">
                      See all
                    </Link>
                  )
                }
              />
              {expiring.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="size-7" />}
                  title="You are all caught up"
                  message={`No subscriptions expire in the next ${w} days. Check back soon.`}
                />
              ) : (
                <CustomerTable customers={expiring.slice(0, 5)} columns={["customer", "expires", "remaining", "actions"]} shortDates />
              )}
            </Card>

            <Card className="overflow-hidden">
              <CardHeader title="Recently Expired" subtitle="Renew or follow up" />
              {expired.length === 0 ? (
                <EmptyState icon={<CheckCircle2 className="size-7" />} title="No expired subscriptions" message="Every customer subscription is still active." />
              ) : (
                <>
                  <ul className="divide-y divide-neutral-100 border-t border-neutral-200">
                    {expired.slice(0, 4).map((c) => (
                      <li key={c.id}>
                        <Link href={`/customers/${c.id}`} className="flex items-center gap-3 px-6 py-4 hover:bg-neutral-25">
                          <Avatar name={c.fullName} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-body font-medium text-neutral-900">{c.fullName}</p>
                            <div className="mt-1">
                              <StatusBadge status="expired" expiresAt={c.expiresAt} />
                            </div>
                          </div>
                          <ExpiredActions id={c.id} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-neutral-100 px-6 py-4">
                    <Link href="/expired" className="text-body font-medium text-primary-600 hover:text-primary-700">
                      View all expired →
                    </Link>
                  </div>
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}


function ExpiredActions({ id }: { id: string }) {
  const { open } = useCustomerActions();
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };
  return (
    <div className="hidden shrink-0 items-center gap-2 sm:flex">
      <Button size="sm" variant="secondary" className="w-[34px] px-0!" aria-label="Message" title="Message" icon={<MessageCircle className="size-4" />} onClick={stop(() => open("reminder", id))} />
      <Button size="sm" onClick={stop(() => open("renew", id))}>
        Renew
      </Button>
    </div>
  );
}
