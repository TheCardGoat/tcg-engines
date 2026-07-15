import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

export interface TargetingContextValue {
  readonly active: boolean;
  readonly candidateIds: ReadonlySet<string>;
  readonly role?: string;
}

const DEFAULT_TARGETING_CONTEXT: TargetingContextValue = {
  active: false,
  candidateIds: new Set(),
};

export const TargetingContext = createContext<TargetingContextValue>(DEFAULT_TARGETING_CONTEXT);

export interface TargetingProviderProps {
  readonly children: ReactNode;
  readonly value?: TargetingContextValue;
  readonly active?: boolean;
  readonly candidateIds?: Iterable<string>;
  readonly role?: string;
}

export function TargetingProvider({
  children,
  value,
  active,
  candidateIds,
  role,
}: TargetingProviderProps) {
  const candidateKey = useMemo(
    () => (candidateIds ? [...candidateIds].sort().join(",") : ""),
    [candidateIds],
  );

  const contextValue = useMemo<TargetingContextValue>(() => {
    if (value) return value;
    if (!active || !candidateKey) return DEFAULT_TARGETING_CONTEXT;
    return {
      active: true,
      candidateIds: new Set(candidateKey.split(",").filter(Boolean)),
      role,
    };
  }, [active, candidateKey, role, value]);

  return <TargetingContext.Provider value={contextValue}>{children}</TargetingContext.Provider>;
}

export function useTargeting(): TargetingContextValue {
  return useContext(TargetingContext);
}
