import type { AnimationRef } from "@tcg/protocol";
import type { SimulatorEntity } from "@tcg/simulator-contract";

export type CardFaceKind = "public" | "hidden";

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CardOverlayState {
  id: string;
  planId: string;
  stepId: string;
  kind: "move" | "enter" | "exit";
  entity: SimulatorEntity;
  from: Rect;
  to: Rect;
  fromRef?: AnimationRef;
  toRef?: AnimationRef;
  sourceFace: CardFaceKind;
  destinationFace: CardFaceKind;
  delayMs: number;
  durationMs: number;
}

export interface BeamOverlayState {
  id: string;
  planId: string;
  stepId: string;
  kind: "effect" | "combat";
  source: Rect;
  sourceRef?: AnimationRef;
  targets: readonly {
    ref: AnimationRef;
    rect: Rect;
  }[];
  label?: string;
  reason?: "declared" | "resolved";
  delayMs: number;
  durationMs: number;
}

export interface ResourceOverlayState {
  id: string;
  planId: string;
  stepId: string;
  anchor: Rect;
  delta: number;
  label?: string;
  delayMs: number;
  durationMs: number;
}

export interface PhaseOverlayState {
  id: string;
  planId: string;
  stepId: string;
  from: string;
  to: string;
  center: { x: number; y: number };
  delayMs: number;
  durationMs: number;
}

export interface LayoutShiftState {
  id: string;
  planId: string;
  stepId: string;
  entityIds: readonly string[];
  delayMs: number;
  durationMs: number;
}

export type MotionOverlayState =
  | { type: "card"; overlay: CardOverlayState }
  | { type: "beam"; overlay: BeamOverlayState }
  | { type: "resource"; overlay: ResourceOverlayState }
  | { type: "phase"; overlay: PhaseOverlayState }
  | { type: "layout-shift"; overlay: LayoutShiftState };

export function stepKeyOf(planId: string, stepId: string): string {
  return `${planId}:${stepId}`;
}

export function refKey(ref: AnimationRef): string {
  return `${ref.kind}:${ref.id}`;
}
