"use client";

import { CalendarCheck2, Info } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/lib/store";
import { fmtDate, renewalPreview } from "@/lib/subscription";
import type { Customer, Duration } from "@/lib/types";
import { Modal } from "../ui/modal";
import { DurationPicker } from "./duration-picker";

export function RenewModal({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  const { renewCustomer, statusOf } = useStore();
  const toast = useToast();
  const [months, setMonths] = useState<Duration>(3);

  if (!customer) return null;
  const newExpiry = renewalPreview(customer.expiresAt, months);

  const confirm = () => {
    const updated = renewCustomer(customer.id, months);
    onClose();
    if (updated) {
      toast({ tone: "success", title: "Subscription renewed", message: `${customer.fullName} · new expiry ${fmtDate(updated.expiresAt)}` });
    } else {
      toast({ tone: "error", title: "Could not renew subscription", message: "Please try again." });
    }
    setMonths(3);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Renew subscription"
      subtitle={customer.fullName}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={confirm} icon={<CalendarCheck2 className="size-[18px]" />}>
            Confirm renewal
          </Button>
        </>
      }
    >
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3">
        <div>
          <p className="text-caption text-neutral-500">Current expiry</p>
          <p className="text-body font-medium text-neutral-900">{fmtDate(customer.expiresAt)}</p>
        </div>
        <StatusBadge status={statusOf(customer)} expiresAt={customer.expiresAt} />
      </div>

      <p className="mt-5 mb-2 text-label font-medium text-neutral-700">Renewal duration</p>
      <DurationPicker value={months} onChange={setMonths} compact />

      <div className="mt-5 rounded-xl bg-primary-50 px-4 py-3.5">
        <p className="text-caption text-primary-700">New expiration date</p>
        <p className="text-[22px] leading-[30px] font-semibold text-primary-900">{fmtDate(newExpiry)}</p>
      </div>

      <p className="mt-4 flex gap-2 text-caption text-neutral-500">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        Payment happens outside this app. Confirming only updates the customer record.
      </p>
    </Modal>
  );
}
