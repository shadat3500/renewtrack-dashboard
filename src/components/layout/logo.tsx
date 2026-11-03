import { Tv } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Brand mark. The Figma uses a 96×96 client logo image —
 * drop the real file in /public/logo.png and swap this for <Image src="/logo.png" …/>.
 */
export function Logo({ size = 96, className }: { size?: 40 | 56 | 96; className?: string }) {
  const s = { 40: "size-10 rounded-xl", 56: "size-14 rounded-2xl", 96: "size-24 rounded-3xl" }[size];
  const i = { 40: "size-5", 56: "size-7", 96: "size-11" }[size];
  return (
    <span className={cn("inline-flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900 text-white shadow-md", s, className)}>
      <Tv className={i} strokeWidth={1.8} />
    </span>
  );
}
