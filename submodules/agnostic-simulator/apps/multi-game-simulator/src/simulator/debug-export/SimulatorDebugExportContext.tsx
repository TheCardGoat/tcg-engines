import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SimulatorDebugExportV1 } from "@tcg/game-page-contract/debug-export";

export interface SimulatorDebugExportRangeRequest {
  startMove?: number;
  endMove?: number;
}

export interface SimulatorDebugExportSource {
  load(request: SimulatorDebugExportRangeRequest): Promise<SimulatorDebugExportV1 | null>;
}

interface SimulatorDebugExportContextValue {
  source: SimulatorDebugExportSource | null;
  register: (source: SimulatorDebugExportSource) => () => void;
}

const Context = createContext<SimulatorDebugExportContextValue | null>(null);

export function SimulatorDebugExportProvider({ children }: { readonly children: ReactNode }) {
  const [source, setSource] = useState<SimulatorDebugExportSource | null>(null);
  const register = useCallback((next: SimulatorDebugExportSource) => {
    setSource(next);
    return () => setSource((current) => (current === next ? null : current));
  }, []);
  const value = useMemo<SimulatorDebugExportContextValue>(
    () => ({ source, register }),
    [register, source],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSimulatorDebugExportSource(): SimulatorDebugExportSource | null {
  return useContext(Context)?.source ?? null;
}

export function useRegisterSimulatorDebugExportSource(
  source: SimulatorDebugExportSource | null,
): void {
  const context = useContext(Context);
  const register = context?.register;
  useEffect(() => {
    if (!register || !source) return;
    return register(source);
  }, [register, source]);
}
