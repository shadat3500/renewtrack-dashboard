"use client";

import { CheckCircle2, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { CustomerTable } from "@/components/customers/customer-table";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { daysLeft, matchesSearch } from "@/lib/subscription";

type Bucket = "all" | "1-3" | "4-7" | "8+";

export default function ExpiringPage() {
  const { customers, statusOf, settings } = useStore();
  const w = settings.expiringWindowDays;
  const [bucket, setBucket] = useState<Bucket>("all");
  const [q, setQ] = useState("");

  const expiring = useMemo(
    () => customers.filter((c) => statusOf(c) === "expiring").sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)),
    [customers, statusOf],
  );

  const inBucket = (d: number, b: Bucket) =>
    b === "all" || (b === "1-3" && d <= 3) || (b === "4-7" && d >= 4 && d <= 7) || (b === "8+" && d >= 8);
  const count = (b: Bucket) => expiring.filter((c) => inBucket(daysLeft(c.expiresAt), b)).length;
  const list = expiring.filter((c) => inBucket(daysLeft(c.expiresAt), bucket) && matchesSearch(c, q));
  const n = expiring.length;

  return (
    <>
      <PageHeader
        title="Expiring Soon"
        subtitle={`${n} subscription${n === 1 ? "" : "s"} expire${n === 1 ? "s" : ""} within the next ${w} days`}
        actions={<SearchInput value={q} onChange={setQ} className="w-full sm:w-[300px]" />}
      />

      {n === 0 ? (
        <Card>
          <EmptyState
            icon={<CheckCircle2 className="size-7" />}
            title={`Nothing expiring in the next ${w} days`}
            message={`You are all caught up. No subscriptions expire in the next ${w} days. Check back soon.`}
          />
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <Tabs
              value={bucket}
              onChange={setBucket}
              items={[
                { value: "all", label: "All", count: n },
                { value: "1-3", label: "1–3 days", count: count("1-3") },
                { value: "4-7", label: "4–7 days", count: count("4-7") },
                ...(w >= 8 ? [{ value: "8+" as Bucket, label: `8–${w} days`, count: count("8+") }] : []),
              ]}
            />
          </div>
          <Card className="overflow-hidden">
            {list.length === 0 ? (
              <EmptyState icon={<SearchX className="size-7" />} title="No matching customers" message="Try another search or range." />
            ) : (
              <CustomerTable customers={list} columns={["customer", "phone", "expires", "remaining", "actions"]} />
            )}
          </Card>
        </>
      )}
    </>
  );
}
