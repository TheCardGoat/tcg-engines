import type { AnimationRef, ValueDeltaStepV2 } from "@tcg/protocol/animations";
import type {
  AnimationSpeed,
  CompiledAnimationPlan,
  SimulatorAnimationStore,
  SimulatorTransition,
} from "@tcg/simulator-runtime/animation";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import { createContext, useContext, type ComponentType } from "react";

import type { AnimationNodeDensity, AnimationNodeRegistry } from "../lib/node-registry";

export interface SimulatorEntityVisualProps {
  readonly entity: SimulatorEntity;
  readonly density: AnimationNodeDensity;
  readonly className?: string;
  /** Lets renderers avoid duplicating a transform already animated by the shared layer. */
  readonly presentation?: "default" | "state-change" | "transfer";
}

export interface SimulatorValueDeltaVisualProps {
  readonly step: ValueDeltaStepV2;
}

export interface AnimationRuntimeContextValue {
  readonly scopeId: string;
  readonly speed: AnimationSpeed;
  /** Reduced-motion playback keeps a short crossfade but removes spatial travel. */
  readonly spatialMotionSuppressed: boolean;
  readonly playbackStartedAtMs?: number;
  readonly transferFaceChange?: "flip" | "instant";
  readonly viewerSeatId: string | null;
  readonly compiledPlan: CompiledAnimationPlan | null;
  readonly activeTransition: SimulatorTransition<unknown> | null;
  readonly registry: AnimationNodeRegistry;
  readonly entityRenderer: ComponentType<SimulatorEntityVisualProps>;
  readonly valueDeltaRenderer?: ComponentType<SimulatorValueDeltaVisualProps>;
  getEntity(state: unknown, entityId: string, face: "public" | "hidden"): SimulatorEntity | null;
  getZone(state: unknown, ref: Extract<AnimationRef, { kind: "zone" }>): SimulatorZone | null;
}

export const AnimationRuntimeContext = createContext<AnimationRuntimeContextValue | null>(null);
export const SimulatorEntityVisualContext =
  createContext<ComponentType<SimulatorEntityVisualProps> | null>(null);

export function useAnimationRuntime(): AnimationRuntimeContextValue {
  const value = useContext(AnimationRuntimeContext);
  if (!value) {
    throw new Error("Animation components must be rendered inside a simulator animation scope.");
  }
  return value;
}

export function useOptionalAnimationRuntime(): AnimationRuntimeContextValue | null {
  return useContext(AnimationRuntimeContext);
}

export interface AnimationStoreContextValue {
  readonly store: SimulatorAnimationStore<unknown>;
}

export const AnimationStoreContext = createContext<AnimationStoreContextValue | null>(null);
