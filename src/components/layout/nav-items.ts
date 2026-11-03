import { AlertTriangle, Clock, LayoutGrid, Settings, Users } from "lucide-react";

export const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/expiring", label: "Expiring", icon: Clock, count: "expiring" as const },
  { href: "/expired", label: "Expired", icon: AlertTriangle, count: "expired" as const },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
