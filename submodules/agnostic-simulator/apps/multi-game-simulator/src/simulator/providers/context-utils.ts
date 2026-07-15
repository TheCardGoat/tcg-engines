import { createContext, useContext } from "react";

export function createRequiredSimulatorContext<T>(fallback: T) {
  const context = createContext<T>(fallback);

  function useValue(): T {
    return useContext(context);
  }

  return [context.Provider, useValue] as const;
}
