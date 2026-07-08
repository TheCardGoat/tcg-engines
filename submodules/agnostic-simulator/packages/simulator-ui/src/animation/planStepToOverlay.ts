import type {
  AnimationPlanStepV1,
  AnimationPlanV1,
  AnimationRef,
  AnimationZoneRef,
} from "@tcg/protocol";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import type { CardFaceKind, MotionOverlayState } from "./motionTypes";
import {
  boardCenter,
  boardRect,
  resolveEntityRefRect,
  resolveRefRect,
  virtualCardRect,
} from "./rectRegistry";
import type { RectCache } from "./rectRegistry";
import { stepKeyOf } from "./motionTypes";

const DEFAULT_CARD_MOVE_DURATION_MS = 560;
const DEFAULT_VISUAL_DURATION_MS = 520;
const DEFAULT_PHASE_DURATION_MS = 780;
const DEFAULT_LAYOUT_SHIFT_DURATION_MS = 220;

export interface PlanStepToOverlayInput {
  plan: AnimationPlanV1;
  step: AnimationPlanStepV1;
  cache: RectCache;
  viewerSeatId: string | null;
  resolveEntity?: (entityId: string) => SimulatorEntity | null | undefined;
  resolveZone?: (zoneRef: AnimationZoneRef) => SimulatorZone | null | undefined;
}

export function planStepToOverlay({
  plan,
  step,
  cache,
  viewerSeatId,
  resolveEntity,
  resolveZone,
}: PlanStepToOverlayInput): MotionOverlayState | null {
  const id = stepKeyOf(plan.id, step.id);
  const delayMs = step.delayMs ?? 0;
  const durationMs = step.durationMs ?? defaultDurationMs(step);
  const anchors = plan.anchors;

  switch (step.type) {
    case "moveEntity": {
      const entity = resolveEntity?.(step.entity.id);
      if (!entity) return null;
      const from = resolveEntityRefRect(step.entity.id, step.from, cache, anchors, "source");
      const to = resolveEntityRefRect(step.entity.id, step.to, cache, anchors, "destination");
      if (!from || !to) return null;
      return {
        type: "card",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          kind: "move",
          entity,
          from,
          to,
          fromRef: step.from,
          toRef: step.to,
          sourceFace: resolveRefFace(step.from, entity, viewerSeatId, resolveZone),
          destinationFace: resolveRefFace(step.to, entity, viewerSeatId, resolveZone),
          delayMs,
          durationMs,
        },
      };
    }
    case "enterEntity": {
      const entity = resolveEntity?.(step.entity.id);
      if (!entity) return null;
      const to = resolveEntityRefRect(step.entity.id, step.to, cache, anchors, "destination");
      if (!to) return null;
      return {
        type: "card",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          kind: "enter",
          entity,
          from: virtualCardRect(to, "source"),
          to,
          toRef: step.to,
          sourceFace: "hidden",
          destinationFace: resolveRefFace(step.to, entity, viewerSeatId, resolveZone),
          delayMs,
          durationMs,
        },
      };
    }
    case "exitEntity": {
      const entity = resolveEntity?.(step.entity.id);
      if (!entity) return null;
      const from = resolveEntityRefRect(step.entity.id, step.from, cache, anchors, "source");
      if (!from) return null;
      return {
        type: "card",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          kind: "exit",
          entity,
          from,
          to: virtualCardRect(from, "destination"),
          fromRef: step.from,
          sourceFace: resolveRefFace(step.from, entity, viewerSeatId, resolveZone),
          destinationFace: "hidden",
          delayMs,
          durationMs,
        },
      };
    }
    case "effect": {
      const source = step.source
        ? resolveRefRect(step.source, cache, anchors, "source")
        : boardRect();
      const targets = step.targets.flatMap((target) => {
        const rect = resolveRefRect(target, cache, anchors, "destination");
        return rect ? [{ ref: target, rect }] : [];
      });
      if (!source || targets.length === 0) return null;
      return {
        type: "beam",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          kind: "effect",
          source,
          sourceRef: step.source,
          targets,
          label: step.label,
          delayMs,
          durationMs,
        },
      };
    }
    case "combat": {
      const source = resolveRefRect(step.source, cache, anchors, "source");
      const target = resolveRefRect(step.target, cache, anchors, "destination");
      if (!source || !target) return null;
      return {
        type: "beam",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          kind: "combat",
          source,
          sourceRef: step.source,
          targets: [{ ref: step.target, rect: target }],
          reason: step.reason,
          delayMs,
          durationMs,
        },
      };
    }
    case "resourceDelta": {
      const anchor =
        (step.anchor ? resolveRefRect(step.anchor, cache, anchors, "destination") : undefined) ??
        resolveRefRect(step.player, cache, anchors, "destination");
      if (!anchor) return null;
      return {
        type: "resource",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          anchor,
          delta: step.delta,
          label: step.label,
          delayMs,
          durationMs,
        },
      };
    }
    case "phaseChange":
      return {
        type: "phase",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          from: step.from,
          to: step.to,
          center: boardCenter(),
          delayMs,
          durationMs,
        },
      };
    case "layoutShift":
      return {
        type: "layout-shift",
        overlay: {
          id,
          planId: plan.id,
          stepId: step.id,
          entityIds: step.entities.map((entity) => entity.id),
          delayMs,
          durationMs,
        },
      };
  }
}

function resolveRefFace(
  ref: AnimationRef | undefined,
  entity: SimulatorEntity,
  viewerSeatId: string | null,
  resolveZone: ((zoneRef: AnimationZoneRef) => SimulatorZone | null | undefined) | undefined,
): CardFaceKind {
  if (!ref || ref.kind !== "zone") {
    return entity.face === "hidden" ? "hidden" : "public";
  }
  const zone = resolveZone?.(ref);
  if (!zone) {
    return entity.face === "hidden" ? "hidden" : "public";
  }
  if (zone.visibility === "public") {
    return "public";
  }
  if (zone.visibility === "secret") {
    return "hidden";
  }
  const ownerId = zone.ownerId ?? entity.ownerId;
  return ownerId === viewerSeatId ? "public" : "hidden";
}

function defaultDurationMs(step: AnimationPlanStepV1): number {
  switch (step.type) {
    case "moveEntity":
    case "enterEntity":
    case "exitEntity":
      return DEFAULT_CARD_MOVE_DURATION_MS;
    case "phaseChange":
      return DEFAULT_PHASE_DURATION_MS;
    case "layoutShift":
      return DEFAULT_LAYOUT_SHIFT_DURATION_MS;
    default:
      return DEFAULT_VISUAL_DURATION_MS;
  }
}
