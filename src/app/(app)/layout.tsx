"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CustomerActionsProvider } from "@/components/customers/actions-provider";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { useStore } from "@/lib/store";

/** Protected area: redirects to /login when not signed in. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  const { ready, authed } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authed) router.replace("/login");
  }, [ready, authed, router]);

  if (!ready || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="size-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600" />
      </div>
    );
  }

  return (
    <CustomerActionsProvider>
      <div className="min-h-screen">
        <Sidebar />
        <main className="pb-28 lg:pb-12 lg:pl-[260px]">
          <div className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6 lg:px-10 lg:pt-8">{children}</div>
        </main>
        <MobileNav />
      </div>
    </CustomerActionsProvider>
  );
}
