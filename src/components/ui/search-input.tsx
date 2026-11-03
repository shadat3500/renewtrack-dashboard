import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export function SearchInput({
  value,
  onChange,
  className,
  placeholder = "Search name, phone or email",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-[15px] size-[18px] -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-[46px] w-full rounded-[10px] border border-neutral-200 bg-white pr-4 pl-[43px] text-body text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
      />
    </div>
  );
}
