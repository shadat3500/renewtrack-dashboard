"use client";

/**
 * Client-side data store (demo mode, saved in localStorage).
 *
 * Every action here maps 1:1 to an API endpoint from the system design:
 *   addCustomer     → POST   /api/customers
 *   updateCustomer  → PUT    /api/customers/:id
 *   renewCustomer   → POST   /api/customers/:id/renew
 *   deleteCustomer  → DELETE /api/customers/:id
 *   updateSettings  → PUT    /api/settings
 *   login / logout  → POST   /api/auth/login | /api/auth/logout
 * Swap the bodies for fetch() calls when the backend is ready.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS, newId, seedCustomers } from "./mock-data";
import { calcExpiry, getStatus, renewalBase, todayISO } from "./subscription";
import type { Customer, CustomerInput, Duration, Settings, Status } from "./types";

const KEY = "subtracker:v1";
const DEMO_PASSWORD = "password123";

interface Persisted {
  customers: Customer[];
  settings: Settings;
  authed: boolean;
  password: string;
}

interface StoreValue {
  ready: boolean;
  authed: boolean;
  customers: Customer[];
  settings: Settings;
  statusOf: (c: Customer) => Status;
  counts: Record<Status | "total", number>;
  getCustomer: (id: string) => Customer | undefined;
  addCustomer: (input: CustomerInput) => Customer;
  updateCustomer: (id: string, input: CustomerInput) => Customer | undefined;
  renewCustomer: (id: string, months: Duration) => Customer | undefined;
  deleteCustomer: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  changePassword: (current: string, next: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  resetDemo: () => void;
  clearAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/** Used during server prerender (no dates computed until the browser loads). */
const EMPTY: Persisted = { customers: [], settings: DEFAULT_SETTINGS, authed: false, password: DEMO_PASSWORD };

function fresh(): Persisted {
  return { customers: seedCustomers(), settings: DEFAULT_SETTINGS, authed: false, password: DEMO_PASSWORD };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Persisted | null>(null);

  // Load once on the client.
  useEffect(() => {
    let loaded: Persisted | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw) as Persisted;
    } catch {
      /* storage blocked → fall back to demo data */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    setData(loaded ?? fresh());
  }, []);

  // Save on every change.
  useEffect(() => {
    if (!data) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const d = data ?? EMPTY;
  const windowDays = d.settings.expiringWindowDays;

  const statusOf = useCallback((c: Customer) => getStatus(c.expiresAt, windowDays), [windowDays]);

  const counts = useMemo(() => {
    const out = { total: d.customers.length, active: 0, expiring: 0, expired: 0 };
    d.customers.forEach((c) => out[getStatus(c.expiresAt, windowDays)]++);
    return out;
  }, [d.customers, windowDays]);

  const patch = (fn: (p: Persisted) => Persisted) => setData((p) => fn(p ?? fresh()));

  const value: StoreValue = {
    ready: data !== null,
    authed: d.authed,
    customers: d.customers,
    settings: d.settings,
    statusOf,
    counts,
    getCustomer: (id) => d.customers.find((c) => c.id === id),

    addCustomer: (input) => {
      const expiresAt = calcExpiry(input.startDate, input.durationMonths);
      const c: Customer = {
        id: newId("c"),
        ...input,
        expiresAt,
        createdAt: todayISO(),
        renewals: [
          {
            id: newId("r"),
            periodStart: input.startDate,
            periodEnd: expiresAt,
            durationMonths: input.durationMonths,
            type: "initial",
            createdAt: todayISO(),
          },
        ],
      };
      patch((p) => ({ ...p, customers: [c, ...p.customers] }));
      return c;
    },

    updateCustomer: (id, input) => {
      const old = d.customers.find((c) => c.id === id);
      if (!old) return undefined;
      const expiresAt = calcExpiry(input.startDate, input.durationMonths);
      const renewals = [...old.renewals];
      const last = renewals[renewals.length - 1];
      if (last) {
        renewals[renewals.length - 1] = {
          ...last,
          periodStart: input.startDate,
          periodEnd: expiresAt,
          durationMonths: input.durationMonths,
        };
      }
      const updated: Customer = { ...old, ...input, expiresAt, renewals };
      patch((p) => ({ ...p, customers: p.customers.map((c) => (c.id === id ? updated : c)) }));
      return updated;
    },

    renewCustomer: (id, months) => {
      const old = d.customers.find((c) => c.id === id);
      if (!old) return undefined;
      const base = renewalBase(old.expiresAt);
      const expiresAt = calcExpiry(base, months);
      const updated: Customer = {
        ...old,
        startDate: base,
        durationMonths: months,
        expiresAt,
        renewals: [
          ...old.renewals,
          { id: newId("r"), periodStart: base, periodEnd: expiresAt, durationMonths: months, type: "renewal", createdAt: todayISO() },
        ],
      };
      patch((p) => ({ ...p, customers: p.customers.map((c) => (c.id === id ? updated : c)) }));
      return updated;
    },

    deleteCustomer: (id) => patch((p) => ({ ...p, customers: p.customers.filter((c) => c.id !== id) })),

    updateSettings: (s) => patch((p) => ({ ...p, settings: { ...p.settings, ...s } })),

    changePassword: (current, next) => {
      if (current !== d.password) return false;
      patch((p) => ({ ...p, password: next }));
      return true;
    },

    login: (email, password) => {
      const ok =
        email.trim().toLowerCase() === d.settings.ownerEmail.toLowerCase() && password === d.password;
      if (ok) patch((p) => ({ ...p, authed: true }));
      return ok;
    },

    logout: () => patch((p) => ({ ...p, authed: false })),

    resetDemo: () => setData({ ...fresh(), authed: true }),
    clearAll: () => patch((p) => ({ ...p, customers: [] })),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
