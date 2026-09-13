import type { SimulatorEntity } from "@tcg/simulator-contract";
import { createContext } from "react";

export interface FabCardPreviewContextValue {
  readonly setHover: (entity: SimulatorEntity, trigger?: HTMLElement) => void;
  readonly clearHover: (entityId: string) => void;
  readonly pin: (entity: SimulatorEntity) => void;
  readonly hide: () => void;
}

/**
 * Keep the context in a dependency-only module. Fast Refresh can then replace
 * the preview provider or its consumers without replacing the context object
 * held by the currently mounted provider.
 */
export const FabCardPreviewContext = createContext<FabCardPreviewContextValue | null>(null);
