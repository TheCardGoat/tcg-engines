import { createContext, useContext, type ReactNode } from "react";
import type { DropEligibility } from "@tcg/protocol";

const LiveDropEligibilityContext = createContext<DropEligibility | null>(null);

export function LiveDropEligibilityProvider({
  value,
  children,
}: {
  value: DropEligibility | null;
  children: ReactNode;
}) {
  return (
    <LiveDropEligibilityContext.Provider value={value}>
      {children}
    </LiveDropEligibilityContext.Provider>
  );
}

export function useLiveDropEligibility(): DropEligibility | null {
  return useContext(LiveDropEligibilityContext);
}
