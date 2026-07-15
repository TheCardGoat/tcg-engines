import { createContext, useContext, type ReactNode } from "react";

interface CyberpunkAnimationVisualState {
  hasPendingAnimations: boolean;
}

const CyberpunkAnimationVisualStateContext = createContext<CyberpunkAnimationVisualState>({
  hasPendingAnimations: false,
});

export function CyberpunkAnimationVisualStateProvider({
  children,
  hasPendingAnimations,
}: {
  children: ReactNode;
  hasPendingAnimations: boolean;
}) {
  return (
    <CyberpunkAnimationVisualStateContext.Provider value={{ hasPendingAnimations }}>
      {children}
    </CyberpunkAnimationVisualStateContext.Provider>
  );
}

export function useCyberpunkAnimationVisualState(): CyberpunkAnimationVisualState {
  return useContext(CyberpunkAnimationVisualStateContext);
}
