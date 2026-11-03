"use client";

import { KeyRound, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Label, Toggle, inputClass } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { settings, updateSettings, resetDemo, clearAll } = useStore();
  const toast = useToast();
  const [name, setName] = useState(settings.ownerName);
  const [email, setEmail] = useState(settings.ownerEmail);
  const [pwOpen, setPwOpen] = useState(false);

  const saveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ tone: "error", title: "Could not save changes", message: "Please check the name and email." });
      return;
    }
    updateSettings({ ownerName: name.trim(), ownerEmail: email.trim() });
    toast({ tone: "success", title: "Account updated" });
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and password." />

      <div className="grid max-w-[760px] gap-5">
        <Card>
          <CardHeader title="Account" />
          <form onSubmit={saveAccount} className="px-6 pb-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Name">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field id="acc-email" label="Email">
                <Input id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" icon={<Save className="size-[18px]" />}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-h3 font-semibold">Password</h3>
              <p className="text-body text-neutral-500">Use a strong password that only you know.</p>
            </div>
            <Button variant="secondary" icon={<KeyRound className="size-[18px]" />} onClick={() => setPwOpen(true)}>
              Change password
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Reminder settings" subtitle="Choose when a customer shows up as “Expiring soon”." />
          <div className="px-6 pb-6">
            <Label htmlFor="window">Expiring soon window</Label>
            <select
              id="window"
              value={settings.expiringWindowDays}
              onChange={(e) => {
                updateSettings({ expiringWindowDays: Number(e.target.value) });
                toast({ tone: "success", title: "Reminder settings saved" });
              }}
              className={cn(inputClass, "sm:max-w-[260px]")}
            >
              {[7, 10, 14, 30].map((d) => (
                <option key={d} value={d}>
                  {d} days before expiry
                </option>
              ))}
            </select>

            <div className="mt-6 flex items-center gap-2">
              <span className="text-label font-medium text-neutral-700">Reminders</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-caption text-neutral-500">Optional</span>
            </div>
            <div className="mt-1 divide-y divide-neutral-100">
              <Toggle id="r7" label="Remind me 7 days before expiry" checked={settings.remind7Days} onChange={(v) => updateSettings({ remind7Days: v })} />
              <Toggle id="r3" label="Remind me 3 days before expiry" checked={settings.remind3Days} onChange={(v) => updateSettings({ remind3Days: v })} />
              <Toggle id="r1" label="Remind me 1 day before expiry" checked={settings.remind1Day} onChange={(v) => updateSettings({ remind1Day: v })} />
            </div>
          </div>
        </Card>

        <Card className="border-dashed">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-h3 font-semibold">Demo data</h3>
              <p className="text-body text-neutral-500">Frontend preview only — data is saved in this browser.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => { clearAll(); toast({ tone: "success", title: "All customers removed" }); }}>
                Clear all
              </Button>
              <Button variant="soft" size="sm" icon={<RotateCcw className="size-4" />} onClick={() => { resetDemo(); toast({ tone: "success", title: "Demo data restored" }); }}>
                Reset demo
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </>
  );
}

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { changePassword } = useStore();
  const toast = useToast();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [err, setErr] = useState<{ cur?: string; next?: string; conf?: string }>({});

  const close = () => {
    setCur("");
    setNext("");
    setConf("");
    setErr({});
    onClose();
  };

  const submit = () => {
    const e: typeof err = {};
    if (!cur) e.cur = "Enter your current password";
    if (next.length < 8) e.next = "Use at least 8 characters";
    if (conf !== next) e.conf = "Passwords do not match";
    setErr(e);
    if (Object.keys(e).length) return;
    if (!changePassword(cur, next)) {
      setErr({ cur: "Current password is incorrect" });
      return;
    }
    toast({ tone: "success", title: "Password updated" });
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change password"
      subtitle="Use at least 8 characters"
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={submit}>Update password</Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field id="cur" label="Current password" error={err.cur}>
          <Input id="cur" type="password" autoComplete="current-password" placeholder="••••••••" value={cur} onChange={(e) => setCur(e.target.value)} invalid={!!err.cur} />
        </Field>
        <Field id="new" label="New password" error={err.next}>
          <Input id="new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} invalid={!!err.next} />
        </Field>
        <Field id="conf" label="Confirm new password" error={err.conf}>
          <Input id="conf" type="password" autoComplete="new-password" value={conf} onChange={(e) => setConf(e.target.value)} invalid={!!err.conf} />
        </Field>
      </div>
    </Modal>
  );
}
