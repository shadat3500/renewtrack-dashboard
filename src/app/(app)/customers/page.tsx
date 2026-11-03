"use client";

import { Plus, SearchX, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { CustomerTable } from "@/components/customers/customer-table";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { matchesSearch } from "@/lib/subscription";
import type { Status } from "@/lib/types";

type Filter = "all" | Status;
const FILTERS: Filter[] = ["all", "active", "expiring", "expired"];

export default function CustomersPage() {
  return (
    <Suspense>
      <Customers />
    </Suspense>
  );
}

function Customers() {
  const { customers, counts, statusOf } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("status") as Filter | null;
  const [filter, setFilter] = useState<Filter>(initial && FILTERS.includes(initial) ? initial : "all");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      customers
        .filter((c) => (filter === "all" ? true : statusOf(c) === filter))
        .filter((c) => matchesSearch(c, q))
        .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)),
    [customers, filter, q, statusOf],
  );

  const changeFilter = (f: Filter) => {
    setFilter(f);
    router.replace(f === "all" ? "/customers" : `/customers?status=${f}`, { scroll: false });
  };

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle={`${counts.total} customer${counts.total === 1 ? "" : "s"} · Manage subscriptions and renewals`}
        actions={
          <>
            <SearchInput value={q} onChange={setQ} className="w-full sm:w-[300px]" />
            <ButtonLink href="/customers/new" icon={<Plus className="size-[18px]" />}>
              Add Customer
            </ButtonLink>
          </>
        }
      />

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
          <div className="mb-4">
            <Tabs
              value={filter}
              onChange={changeFilter}
              items={[
                { value: "all", label: "All", count: counts.total },
                { value: "active", label: "Active", count: counts.active },
                { value: "expiring", label: "Expiring", count: counts.expiring },
                { value: "expired", label: "Expired", count: counts.expired },
              ]}
            />
          </div>
          <Card className="overflow-hidden">
            {list.length === 0 ? (
              <EmptyState icon={<SearchX className="size-7" />} title="No matching customers" message="Try another name, phone number or filter." />
            ) : (
              <CustomerTable
                customers={list}
                columns={["customer", "phone", "start", "duration", "expires", "status", "actions"]}
              />
            )}
          </Card>
        </>
      )}
    </>
  );
}
