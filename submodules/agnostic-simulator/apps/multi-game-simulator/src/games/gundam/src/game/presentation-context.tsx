import { createContext, useContext, type ReactNode } from "react";

import type { BoardProjection } from "./types.ts";

const GundamPresentationContext = createContext<BoardProjection | null>(null);

export function GundamPresentationProvider({
  value,
  children,
}: {
  readonly value: BoardProjection;
  readonly children: ReactNode;
}) {
  return (
    <GundamPresentationContext.Provider value={value}>
      {children}
    </GundamPresentationContext.Provider>
  );
}

export function useGundamPresentation(): BoardProjection | null {
  return useContext(GundamPresentationContext);
}
