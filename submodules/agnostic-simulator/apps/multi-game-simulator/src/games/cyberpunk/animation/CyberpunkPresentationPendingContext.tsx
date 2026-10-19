import { createContext, useContext, type ReactNode } from "react";

const CyberpunkPresentationPendingContext = createContext(false);

export function CyberpunkPresentationPendingProvider({
  pending,
  children,
}: {
  readonly pending: boolean;
  readonly children: ReactNode;
}) {
  return (
    <CyberpunkPresentationPendingContext.Provider value={pending}>
      {children}
    </CyberpunkPresentationPendingContext.Provider>
  );
}

export function useCyberpunkPresentationPending(): boolean {
  return useContext(CyberpunkPresentationPendingContext);
}
