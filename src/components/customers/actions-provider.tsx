"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "@/lib/store";
import { DeleteModal } from "./delete-modal";
import { ReminderModal } from "./reminder-modal";
import { RenewModal } from "./renew-modal";

type Kind = "renew" | "reminder" | "delete";
interface Ctx {
  open: (kind: Kind, customerId: string, opts?: { onDeleted?: () => void }) => void;
}

const ActionsContext = createContext<Ctx>({ open: () => {} });

/** Mount once; any page can call useCustomerActions().open("renew", id). */
export function CustomerActionsProvider({ children }: { children: React.ReactNode }) {
  const { getCustomer } = useStore();
  const [state, setState] = useState<{ kind: Kind; id: string; onDeleted?: () => void } | null>(null);
  const customer = state ? (getCustomer(state.id) ?? null) : null;
  const close = () => setState(null);

  return (
    <ActionsContext.Provider value={{ open: (kind, id, opts) => setState({ kind, id, ...opts }) }}>
      {children}
      {state?.kind === "renew" && <RenewModal customer={customer} onClose={close} />}
      {state?.kind === "reminder" && <ReminderModal customer={customer} onClose={close} />}
      {state?.kind === "delete" && <DeleteModal customer={customer} onClose={close} onDeleted={state.onDeleted} />}
    </ActionsContext.Provider>
  );
}

export const useCustomerActions = () => useContext(ActionsContext);
