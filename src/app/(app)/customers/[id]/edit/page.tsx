"use client";

import { useParams } from "next/navigation";
import { CustomerForm } from "@/components/customers/customer-form";
import { NotFoundCustomer } from "@/components/customers/not-found";
import { PageHeader } from "@/components/layout/page-header";
import { useStore } from "@/lib/store";

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const c = useStore().getCustomer(id);
  if (!c) return <NotFoundCustomer />;
  return (
    <>
      <PageHeader
        back={{ href: `/customers/${c.id}`, label: c.fullName }}
        title="Edit customer"
        subtitle="Changing the start date or duration recalculates the expiry date."
      />
      <CustomerForm initial={c} />
    </>
  );
}
