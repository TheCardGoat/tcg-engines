import type {
  AnimationRef,
  AnimationStepV2,
  EntityStateChangeStepV2,
  EntityTransferStepV2,
  ValueDeltaStepV2,
} from "@tcg/protocol/animations";
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

export interface SimulatorSpatialTransfer {
  readonly id: string;
  readonly step: EntityTransferStepV2;
  readonly sourceEntity: SimulatorEntity;
  readonly destinationEntity: SimulatorEntity;
  readonly sourceRect: DOMRect;
  readonly destinationRect: DOMRect;
  readonly density: AnimationNodeDensity;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly faceChanges: boolean;
  readonly sourceVisible: boolean;
  readonly destinationVisible: boolean;
}

export interface SimulatorSpatialTransferRendererProps {
  /** The renderer stays mounted while idle; an empty list must clear its visuals
   * and stop continuous rendering without disposing match-lifetime resources. */
  readonly transfers: readonly SimulatorSpatialTransfer[];
  readonly playbackStartedAtMs?: number;
}

export interface SimulatorSpatialStateChange {
  readonly id: string;
  readonly step: EntityStateChangeStepV2;
  readonly sourceEntity: SimulatorEntity;
  readonly destinationEntity: SimulatorEntity;
  readonly rect: DOMRect;
  readonly density: AnimationNodeDensity;
  readonly startAtMs: number;
  readonly durationMs: number;
}

export interface SimulatorSpatialStateChangeRendererProps {
  readonly changes: readonly SimulatorSpatialStateChange[];
  readonly playbackStartedAtMs?: number;
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
  readonly spatialTransferRenderer?: ComponentType<SimulatorSpatialTransferRendererProps>;
  readonly spatialTransferKinds?: readonly SimulatorEntity["kind"][];
  readonly spatialStateChangeRenderer?: ComponentType<SimulatorSpatialStateChangeRendererProps>;
  readonly spatialStateChangeKinds?: readonly SimulatorEntity["kind"][];
  readonly suppressedOverlayStepTypes?: readonly AnimationStepV2["type"][];
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
