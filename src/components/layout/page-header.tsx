import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  actions,
  back,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-6">
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1 text-body font-medium text-neutral-500 hover:text-primary-600"
        >
          <ChevronLeft className="size-[18px]" /> {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] leading-8 font-semibold text-neutral-900 sm:text-h1">{title}</h1>
          {subtitle && <p className="mt-1 text-body text-neutral-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
      </div>
    </header>
  );
}
