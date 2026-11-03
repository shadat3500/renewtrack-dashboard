"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CountPill } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { Logo } from "./logo";
import { NAV, isActive } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { counts, settings, logout } = useStore();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-neutral-200 bg-white px-4 pt-7 pb-6 lg:flex">
      <Link href="/" aria-label="Dashboard" className="mb-4 self-start">
        <Logo size={96} />
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Main">
        {NAV.map(({ href, label, icon: Icon, count }) => {
          const active = isActive(pathname, href);
          const n = count ? counts[count] : 0;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-[10px] px-3 text-body font-medium transition-colors",
                active ? "bg-primary-50 text-primary-700" : "text-neutral-500 hover:bg-neutral-25 hover:text-neutral-900",
              )}
            >
              <Icon className="size-5" />
              <span className="flex-1">{label}</span>
              {count && n > 0 && <CountPill tone={count === "expired" ? "danger" : "warning"}>{n}</CountPill>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 rounded-xl px-2 py-0.5">
        <Avatar name={settings.ownerName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-medium text-neutral-900">{settings.ownerName}</p>
          <p className="text-caption text-neutral-500">Business owner</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          aria-label="Log out"
          title="Log out"
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <LogOut className="size-[18px]" />
        </button>
      </div>
    </aside>
  );
}
