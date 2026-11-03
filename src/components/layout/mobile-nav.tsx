"use client";

import { AlertTriangle, Clock, LayoutGrid, LogOut, MoreHorizontal, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useStore } from "@/lib/store";
import { isActive } from "./nav-items";

const TABS = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/expiring", label: "Expiring", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { counts, logout } = useStore();
  const [more, setMore] = useState(false);
  const moreActive = isActive(pathname, "/expired") || isActive(pathname, "/settings");

  return (
    <>
      {more && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMore(false)}>
          <div className="absolute inset-0 animate-fade-in bg-neutral-900/40" />
          <div
            className="absolute inset-x-3 bottom-[88px] animate-pop-in rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { href: "/expired", label: `Expired (${counts.expired})`, icon: AlertTriangle },
              { href: "/settings", label: "Settings", icon: Settings },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMore(false)}
                className="flex h-12 items-center gap-3 rounded-xl px-3 text-body font-medium text-neutral-700 hover:bg-neutral-25"
              >
                <Icon className="size-5 text-neutral-500" /> {label}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-body font-medium text-danger-600 hover:bg-danger-50"
            >
              <LogOut className="size-5" /> Log out
            </button>
          </div>
        </div>
      )}

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 grid h-[77px] grid-cols-4 border-t border-neutral-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 text-caption font-medium",
                active ? "text-primary-600" : "text-neutral-500",
              )}
            >
              <Icon className="size-[22px]" />
              {label}
              {href === "/expiring" && counts.expiring > 0 && (
                <span className="absolute top-3 left-1/2 ml-2 flex size-[18px] items-center justify-center rounded-full bg-warning-600 text-[10px] font-bold text-white">
                  {counts.expiring}
                </span>
              )}
            </Link>
          );
        })}
        <button
          onClick={() => setMore((m) => !m)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 text-caption font-medium",
            more || moreActive ? "text-primary-600" : "text-neutral-500",
          )}
        >
          <MoreHorizontal className="size-[22px]" />
          More
        </button>
      </nav>
    </>
  );
}
