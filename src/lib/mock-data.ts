/**
 * Demo data, generated relative to today so the dashboard always
 * has expiring + expired customers to show. Replace with API data.
 */
import { addDays, parseISO, subMonths } from "date-fns";
import { calcExpiry, toISO, today } from "./subscription";
import type { Customer, Duration, Renewal, Settings } from "./types";

export const DEFAULT_TEMPLATE =
  "Hi {name}, your TV subscription expires on {expiry} ({daysLeft} days left). Please renew to keep your service running. Thank you!";

export const DEFAULT_SETTINGS: Settings = {
  ownerName: "Alex Owner",
  ownerEmail: "owner@email.com",
  expiringWindowDays: 10,
  remind7Days: true,
  remind3Days: true,
  remind1Day: false,
  reminderTemplate: DEFAULT_TEMPLATE,
};

let seq = 0;
const id = (p: string) => `${p}_${(++seq).toString(36)}${Date.now().toString(36).slice(-4)}`;

/** Build a customer whose CURRENT period ends `expiresInDays` from today. */
function make(
  fullName: string,
  phone: string,
  durationMonths: Duration,
  expiresInDays: number,
  previousPeriods = 0,
): Customer {
  const expiresAt = toISO(addDays(today(), expiresInDays));
  const startDate = toISO(subMonths(parseISO(expiresAt), durationMonths));
  const renewals: Renewal[] = [];
  let pStart = toISO(subMonths(parseISO(startDate), durationMonths * previousPeriods));
  for (let i = 0; i <= previousPeriods; i++) {
    const pEnd = calcExpiry(pStart, durationMonths);
    renewals.push({
      id: id("r"),
      periodStart: pStart,
      periodEnd: pEnd,
      durationMonths,
      type: i === 0 ? "initial" : "renewal",
      createdAt: pStart,
    });
    pStart = pEnd;
  }
  const email = `${fullName.split(" ")[0].toLowerCase()}@email.com`;
  return {
    id: id("c"),
    fullName,
    phone,
    email,
    startDate,
    durationMonths,
    expiresAt,
    renewals,
    createdAt: renewals[0].periodStart,
  };
}

export function seedCustomers(): Customer[] {
  const list: Customer[] = [
    make("John Smith", "+1 555 012 3456", 3, 3, 1),
    make("Michael Brown", "+1 555 013 7788", 3, 7),
    make("David Lee", "+1 555 014 6621", 6, 10),
    make("Priya Das", "+1 555 016 8802", 3, 10, 2),
    make("Robert Hall", "+1 555 017 4410", 6, -2),
    make("James Cole", "+1 555 018 2965", 3, -5, 1),
    {
      ...make("Sarah Khan", "+1 555 019 2210", 3, 0),
      // started today → 3 full months
      startDate: toISO(today()),
      expiresAt: calcExpiry(toISO(today()), 3),
    },
    make("Emma Wilson", "+1 555 011 9034", 12, 240),
  ];
  // Fix Sarah's history to match her start date.
  const sarah = list[6];
  sarah.renewals = [
    { id: id("r"), periodStart: sarah.startDate, periodEnd: sarah.expiresAt, durationMonths: 3, type: "initial", createdAt: sarah.startDate },
  ];
  sarah.createdAt = sarah.startDate;

  const more: [string, Duration, number][] = [
    ["Olivia Martinez", 6, 45], ["Liam Johnson", 3, 21], ["Ava Thompson", 12, 300],
    ["Noah Garcia", 3, 62], ["Mia Anderson", 6, 130], ["Ethan Clark", 3, 15],
    ["Sophia Lewis", 12, 190], ["Lucas Walker", 6, 88], ["Isabella Young", 3, 33],
    ["Mason King", 6, 155], ["Amelia Wright", 3, 50], ["Logan Scott", 12, 260],
    ["Harper Green", 3, 27], ["Elijah Baker", 6, 101], ["Evelyn Adams", 3, 70],
    ["Aiden Nelson", 12, 330], ["Abigail Hill", 6, 118], ["Carter Ramirez", 3, 18],
    ["Ella Campbell", 6, 142], ["Owen Mitchell", 3, 40], ["Aria Roberts", 12, 210],
    ["Daniel Turner", 3, 84],
  ];
  more.forEach(([name, dur, days], i) => {
    list.push(make(name, `+1 555 0${20 + i} ${String(1000 + i * 137).slice(-4)}`, dur, days, i % 3));
  });
  return list;
}

export const newId = id;
