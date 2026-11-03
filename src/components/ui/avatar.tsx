import { cn } from "@/lib/cn";
import { initials } from "@/lib/subscription";

const palette = [
  "bg-primary-100 text-primary-700",
  "bg-success-50 text-success-600",
  "bg-warning-50 text-warning-700",
  "bg-sky-100 text-sky-700",
  "bg-pink-100 text-pink-700",
  "bg-violet-100 text-violet-700",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ name, size = 36, className }: { name: string; size?: 36 | 40 | 56; className?: string }) {
  const sz = { 36: "size-9 text-caption", 40: "size-10 text-caption", 56: "size-14 text-[20px]" }[size];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        sz,
        palette[hash(name) % palette.length],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
