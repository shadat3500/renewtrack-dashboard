"use client";

import { CalendarDays, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/lib/store";
import { calcExpiry, durationLabel, fmtDate, getStatus, todayISO } from "@/lib/subscription";
import type { Customer, CustomerInput } from "@/lib/types";
import { DurationPicker } from "./duration-picker";

type Errors = Partial<Record<keyof CustomerInput, string>>;

function validate(v: CustomerInput): Errors {
  const e: Errors = {};
  if (!v.fullName.trim()) e.fullName = "Enter the customer's full name";
  if (!v.phone.trim()) e.phone = "Enter a phone number";
  else if (!/^[+\d][\d\s()-]{6,}$/.test(v.phone.trim())) e.phone = "Enter a valid phone number";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email";
  if (!v.startDate) e.startDate = "Pick a start date";
  return e;
}

export function CustomerForm({ initial }: { initial?: Customer }) {
  const router = useRouter();
  const toast = useToast();
  const { addCustomer, updateCustomer, settings } = useStore();
  const [v, setV] = useState<CustomerInput>({
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    startDate: initial?.startDate ?? todayISO(),
    durationMonths: initial?.durationMonths ?? 3,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof CustomerInput>(k: K, val: CustomerInput[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (touched) setErrors(validate(next));
  };

  const expiresAt = v.startDate ? calcExpiry(v.startDate, v.durationMonths) : null;
  const status = expiresAt ? getStatus(expiresAt, settings.expiringWindowDays) : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast({ tone: "error", title: "Could not save customer", message: "Please check the details and try again." });
      return;
    }
    const clean = { ...v, fullName: v.fullName.trim(), phone: v.phone.trim(), email: v.email.trim() };
    const saved = initial ? updateCustomer(initial.id, clean) : addCustomer(clean);
    if (!saved) {
      toast({ tone: "error", title: "Could not save customer", message: "Please check the details and try again." });
      return;
    }
    toast({
      tone: "success",
      title: initial ? "Customer updated" : "Customer saved",
      message: `${saved.fullName} · expires ${fmtDate(saved.expiresAt)}`,
    });
    router.push(`/customers/${saved.id}`);
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 xl:grid-cols-[minmax(0,700px)_380px]">
      <Card className="p-5 sm:p-7">
        <h2 className="text-h3 font-semibold text-neutral-900">Customer information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field id="fullName" label="Full name" error={errors.fullName}>
            <Input id="fullName" value={v.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="e.g. John Smith" invalid={!!errors.fullName} autoComplete="name" />
          </Field>
          <Field id="phone" label="Phone number" error={errors.phone}>
            <Input id="phone" type="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 012 3456" invalid={!!errors.phone} autoComplete="tel" />
          </Field>
        </div>
        <Field id="email" label="Email" error={errors.email} className="mt-5" hint={<span className="text-caption text-neutral-400">Optional</span>}>
          <Input id="email" type="email" value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="name@email.com" invalid={!!errors.email} autoComplete="email" />
        </Field>

        <hr className="my-6 border-neutral-200" />

        <h2 className="text-h3 font-semibold text-neutral-900">Subscription</h2>
        <Field id="startDate" label="Subscription start date" error={errors.startDate} className="mt-5">
          <div className="relative">
            <Input id="startDate" type="date" value={v.startDate} onChange={(e) => set("startDate", e.target.value)} invalid={!!errors.startDate} className="pr-12" />
            <CalendarDays className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-neutral-400" />
          </div>
        </Field>
        <div className="mt-5">
          <p className="mb-1.5 text-label font-medium text-neutral-700">Subscription duration</p>
          <DurationPicker value={v.durationMonths} onChange={(d) => set("durationMonths", d)} startDate={v.startDate || undefined} />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ButtonLink href={initial ? `/customers/${initial.id}` : "/customers"} variant="secondary">
            Cancel
          </ButtonLink>
          <Button type="submit" icon={<Save className="size-[18px]" />}>
            {initial ? "Save changes" : "Save Customer"}
          </Button>
        </div>
      </Card>

      <Card className="h-fit p-6 xl:sticky xl:top-8">
        <h2 className="text-h3 font-semibold text-neutral-900">Subscription summary</h2>
        <dl className="mt-4 space-y-3 text-body">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Start date</dt>
            <dd className="font-medium text-neutral-900">{v.startDate ? fmtDate(v.startDate) : "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Duration</dt>
            <dd className="font-medium text-neutral-900">{durationLabel(v.durationMonths)}</dd>
          </div>
        </dl>
        <div className="mt-5 rounded-xl bg-primary-50 px-4 py-3.5">
          <p className="text-caption text-primary-700">Expiration date</p>
          <p className="text-[22px] leading-[30px] font-semibold text-primary-900">{expiresAt ? fmtDate(expiresAt) : "—"}</p>
          <p className="text-caption text-neutral-500">Calculated automatically</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-body text-neutral-500">Status after saving</span>
          {status && expiresAt && <StatusBadge status={status} expiresAt={expiresAt} withLabel />}
        </div>
      </Card>
    </form>
  );
}
