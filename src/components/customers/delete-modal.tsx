"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/lib/store";
import type { Customer } from "@/lib/types";
import { Modal } from "../ui/modal";

export function DeleteModal({
  customer,
  onClose,
  onDeleted,
}: {
  customer: Customer | null;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const { deleteCustomer } = useStore();
  const toast = useToast();
  if (!customer) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title={`Delete ${customer.fullName}?`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            icon={<Trash2 className="size-[18px]" />}
            onClick={() => {
              deleteCustomer(customer.id);
              onClose();
              onDeleted?.();
              toast({ tone: "success", title: "Customer deleted", message: customer.fullName });
            }}
          >
            Delete customer
          </Button>
        </>
      }
    >
      <div className="flex gap-4 rounded-xl bg-danger-50 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-danger-600">
          <Trash2 className="size-5" />
        </span>
        <p className="text-body text-neutral-700">
          This permanently removes the customer and their subscription records. This cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
