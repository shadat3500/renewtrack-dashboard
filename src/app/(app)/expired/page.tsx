"use client";

import { CheckCircle2, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { CustomerTable } from "@/components/customers/customer-table";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { useStore } from "@/lib/store";
import { matchesSearch } from "@/lib/subscription";

export default function ExpiredPage() {
  const { customers, statusOf } = useStore();
  const [q, setQ] = useState("");
  const expired = useMemo(
    () => customers.filter((c) => statusOf(c) === "expired").sort((a, b) => b.expiresAt.localeCompare(a.expiresAt)),
    [customers, statusOf],
  );
  const list = expired.filter((c) => matchesSearch(c, q));
  const n = expired.length;

  return (
    <>
      <PageHeader
        title="Expired"
        subtitle={`${n} subscription${n === 1 ? " has" : "s have"} expired · Renew them or follow up`}
        actions={<SearchInput value={q} onChange={setQ} className="w-full sm:w-[300px]" />}
      />
      <Card className="overflow-hidden">
        {n === 0 ? (
          <EmptyState icon={<CheckCircle2 className="size-7" />} title="No expired subscriptions" message="Every customer subscription is still active." />
        ) : list.length === 0 ? (
          <EmptyState icon={<SearchX className="size-7" />} title="No matching customers" message="Try another name or phone number." />
        ) : (
          <CustomerTable customers={list} columns={["customer", "phone", "expiredOn", "status", "actions"]} />
        )}
      </Card>
    </>
  );
}
