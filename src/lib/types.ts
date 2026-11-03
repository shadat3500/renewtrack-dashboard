export type Duration = 3 | 6 | 12;
export const DURATIONS: Duration[] = [3, 6, 12];

export type Status = "active" | "expiring" | "expired";

/** Dates are stored as calendar days: "yyyy-MM-dd". */
export interface Renewal {
  id: string;
  periodStart: string;
  periodEnd: string;
  durationMonths: Duration;
  type: "initial" | "renewal";
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  startDate: string;
  durationMonths: Duration;
  expiresAt: string;
  renewals: Renewal[];
  createdAt: string;
}

export interface CustomerInput {
  fullName: string;
  phone: string;
  email: string;
  startDate: string;
  durationMonths: Duration;
}

export interface Settings {
  ownerName: string;
  ownerEmail: string;
  expiringWindowDays: number;
  remind7Days: boolean;
  remind3Days: boolean;
  remind1Day: boolean;
  reminderTemplate: string;
}
