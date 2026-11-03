"use client";

import { CalendarClock, Eye, EyeOff, LogIn, MessageCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { ready, authed, login } = useStore();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && authed) router.replace("/");
  }, [ready, authed, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (login(email, password)) router.replace("/");
    else setError("Email or password is incorrect.");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-14 text-white lg:flex lg:flex-col">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-primary-600/40 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <Logo size={56} className="bg-none bg-white/15 ring-1 ring-white/25" />
          <span className="text-[22px] font-bold tracking-tight">RenewTrack</span>
        </div>
        <div className="relative mt-auto max-w-md">
          <h2 className="text-[36px] leading-[44px] font-bold">Never miss a renewal again.</h2>
          <p className="mt-4 text-[16px] leading-7 text-primary-100">
            See who expires soon, send a reminder in seconds and keep every customer subscribed.
          </p>
          <ul className="mt-10 space-y-4 text-body text-primary-100">
            {[
              [CalendarClock, "Expiry dates calculated automatically"],
              [MessageCircle, "Ready-to-send reminder messages"],
              [RefreshCw, "One-click renewals with full history"],
            ].map(([Icon, text]) => {
              const I = Icon as typeof CalendarClock;
              return (
                <li key={text as string} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                    <I className="size-[18px]" />
                  </span>
                  {text as string}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-6">
        <form onSubmit={submit} noValidate className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo size={56} />
            <span className="text-[22px] font-bold tracking-tight text-neutral-900">RenewTrack</span>
          </div>
          <h1 className="text-h1 font-semibold text-neutral-900">Welcome back</h1>
          <p className="mt-1.5 text-body text-neutral-500">Log in to manage your customers.</p>

          <Field id="email" label="Email or username" className="mt-5">
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="owner@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              invalid={!!error}
            />
          </Field>

          <Field
            id="password"
            label="Password"
            className="mt-5"
            error={error}
            hint={
              <button
                type="button"
                className="text-body font-medium text-primary-600 hover:text-primary-700"
                onClick={() => toast({ tone: "success", title: "Reset link", message: "Password reset is set up with the backend (email)." })}
              >
                Forgot password?
              </button>
            }
          >
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                invalid={!!error}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1.5 text-neutral-400 hover:text-neutral-700"
              >
                {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            </div>
          </Field>

          <Button type="submit" className="mt-8 w-full" icon={<LogIn className="size-[18px]" />}>
            Log in
          </Button>

          <p className="mt-6 rounded-xl bg-neutral-25 px-4 py-3 text-caption text-neutral-500">
            Demo login: <span className="font-medium text-neutral-700">owner@email.com</span> /{" "}
            <span className="font-medium text-neutral-700">password123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
