/**
 * All subscription business rules live here.
 * The backend should use the exact same rules (copy this file into the API).
 */
import {
  addMonths,
  differenceInCalendarDays,
  format,
  isAfter,
  parseISO,
  startOfDay,
} from "date-fns";
import type { Customer, Duration, Status } from "./types";

export const toISO = (d: Date) => format(d, "yyyy-MM-dd");
export const today = () => startOfDay(new Date());
export const todayISO = () => toISO(today());

/** expiresAt = startDate + duration (Jan 31 + 1 month → Feb 28) */
export const calcExpiry = (startDate: string, months: Duration) =>
  toISO(addMonths(parseISO(startDate), months));

export const daysLeft = (expiresAt: string) =>
  differenceInCalendarDays(parseISO(expiresAt), today());

export function getStatus(expiresAt: string, windowDays: number): Status {
  const d = daysLeft(expiresAt);
  if (d < 0) return "expired";
  if (d <= windowDays) return "expiring";
  return "active";
}

/**
 * Renewal starts from the current expiry if it is still in the future
 * (early renew keeps remaining days), otherwise from today.
 */
export const renewalBase = (expiresAt: string) => {
  const exp = parseISO(expiresAt);
  const now = today();
  return toISO(isAfter(exp, now) ? exp : now);
};

export const renewalPreview = (expiresAt: string, months: Duration) =>
  calcExpiry(renewalBase(expiresAt), months);

export function remainingLabel(expiresAt: string) {
  const d = daysLeft(expiresAt);
  if (d < -1) return `Expired ${-d} days ago`;
  if (d === -1) return "Expired yesterday";
  if (d === 0) return "Expires today";
  if (d === 1) return "1 day left";
  return `${d} days left`;
}

export const fmtShort = (iso: string) => format(parseISO(iso), "MMM d");
export const fmtDate = (iso: string) => format(parseISO(iso), "MMM d, yyyy");
export const fmtLong = (iso: string) => format(parseISO(iso), "MMMM d, yyyy");
export const fmtToday = () => format(today(), "EEEE, MMMM d, yyyy");
export const fmtTodayShort = () => format(today(), "EEE, MMM d");

export const durationLabel = (m: Duration) => `${m} months`;
export const durationShort = (m: Duration) => `${m} mo`;

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

export function fillTemplate(template: string, c: Customer) {
  const d = daysLeft(c.expiresAt);
  return template
    .replaceAll("{name}", firstName(c.fullName))
    .replaceAll("{expiry}", fmtDate(c.expiresAt))
    .replaceAll("{daysLeft}", String(Math.max(d, 0)))
    .replaceAll("{remaining}", remainingLabel(c.expiresAt).toLowerCase());
}

export function matchesSearch(c: Customer, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    c.fullName.toLowerCase().includes(s) ||
    c.email.toLowerCase().includes(s) ||
    c.phone.replace(/\s/g, "").includes(s.replace(/\s/g, ""))
  );
}
