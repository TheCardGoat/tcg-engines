import { createContext, useContext, type ReactNode } from "react";

const CyberpunkAnimationActivityContext = createContext(false);

export function CyberpunkAnimationActivityProvider({
  active,
  children,
}: {
  readonly active: boolean;
  readonly children: ReactNode;
}) {
  return (
    <CyberpunkAnimationActivityContext.Provider value={active}>
      {children}
    </CyberpunkAnimationActivityContext.Provider>
  );
}

export function useCyberpunkAnimationActive(): boolean {
  return useContext(CyberpunkAnimationActivityContext);
}
