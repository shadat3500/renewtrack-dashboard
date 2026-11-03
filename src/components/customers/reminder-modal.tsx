"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { daysLeft, fillTemplate, firstName, fmtDate } from "@/lib/subscription";
import type { Customer } from "@/lib/types";
import { Modal } from "../ui/modal";

type Tpl = "default" | "7" | "3" | "1" | "expired";

function quickTemplate(kind: Tpl, c: Customer, base: string) {
  const name = firstName(c.fullName);
  const exp = fmtDate(c.expiresAt);
  switch (kind) {
    case "7":
      return `Hi ${name}, a friendly reminder that your TV subscription expires on ${exp} — 7 days from now. Reply to renew and keep watching without interruption. Thank you!`;
    case "3":
      return `Hi ${name}, your TV subscription expires on ${exp} (3 days left). Please renew to keep your service running. Thank you!`;
    case "1":
      return `Hi ${name}, your TV subscription expires tomorrow (${exp}). Renew today to avoid any interruption. Thank you!`;
    case "expired":
      return `Hi ${name}, your TV subscription expired on ${exp}. Renew now to get your service back right away. Thank you!`;
    default:
      return fillTemplate(base, c);
  }
}

export function ReminderModal({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  if (!customer) return null;
  // keyed so state resets per customer
  return <ReminderBody key={customer.id} customer={customer} onClose={onClose} />;
}

function ReminderBody({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { settings } = useStore();
  const toast = useToast();
  const d = daysLeft(customer.expiresAt);
  const initial: Tpl = d < 0 ? "expired" : "default";
  const [tpl, setTpl] = useState<Tpl>(initial);
  const [text, setText] = useState(() => quickTemplate(initial, customer, settings.reminderTemplate));
  const [copied, setCopied] = useState(false);

  const chips: { k: Tpl; label: string }[] =
    d < 0
      ? [{ k: "expired", label: "Expired" }]
      : [
          { k: "default", label: "Standard" },
          { k: "7", label: "7 days left" },
          { k: "3", label: "3 days left" },
          { k: "1", label: "1 day left" },
        ];

  const pick = (k: Tpl) => {
    setTpl(k);
    setText(quickTemplate(k, customer, settings.reminderTemplate));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ tone: "success", title: "Message copied", message: "Paste it into WhatsApp or SMS." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ tone: "error", title: "Could not copy", message: "Select the text and copy it manually." });
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Send reminder"
      subtitle={`${customer.fullName} · ${customer.phone}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={copy} icon={copied ? <Check className="size-[18px]" /> : <Copy className="size-[18px]" />}>
            {copied ? "Copied" : "Copy message"}
          </Button>
        </>
      }
    >
      <p className="mb-2 text-label font-medium text-neutral-700">Quick template</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.k}
            onClick={() => pick(c.k)}
            className={cn(
              "h-[38px] rounded-full border px-[15px] text-body font-medium transition-colors",
              tpl === c.k
                ? "border-primary-600 bg-primary-50 text-primary-700"
                : "border-neutral-200 text-neutral-500 hover:text-neutral-900",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <label htmlFor="reminder-text" className="mt-5 mb-1.5 block text-label font-medium text-neutral-700">
        Message
      </label>
      <textarea
        id="reminder-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-25 p-4 text-body text-neutral-900 outline-none focus:border-primary-600 focus:bg-white focus:ring-4 focus:ring-primary-100"
      />
    </Modal>
  );
}
