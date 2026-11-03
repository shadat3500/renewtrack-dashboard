import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "soft" | "danger" | "ghost";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
  secondary: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-25 hover:border-neutral-400/60",
  soft: "bg-primary-50 text-primary-700 hover:bg-primary-100",
  danger: "bg-danger-600 text-white hover:bg-red-700 shadow-sm",
  ghost: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
};

const sizes: Record<Size, string> = {
  md: "h-[42px] px-[18px] gap-2 text-sm",
  sm: "h-[34px] px-3 gap-1.5 text-[13px]",
};

const base =
  "inline-flex shrink-0 items-center justify-center rounded-[10px] font-semibold leading-5 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600";

interface Common {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
}: Common & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {icon}
      {children}
    </Link>
  );
}
