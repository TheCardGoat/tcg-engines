import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import {
  resolveAnimationCardFaceForViewer,
  type SimulatorAnimationCardFace,
  type SimulatorAnimationEvent,
  type SimulatorAnimationViewerContext,
  type SimulatorAttachEvent,
  type SimulatorFlipRevealEvent,
  type SimulatorZoneEnterEvent,
  type SimulatorZoneExitEvent,
} from "./events";

export type SimulatorPrimitiveOverlayEvent =
  | SimulatorFlipRevealEvent
  | SimulatorZoneEnterEvent
  | SimulatorZoneExitEvent
  | SimulatorAttachEvent;

export type SimulatorPrimitiveOverlayKind = "flip-reveal" | "zone-enter" | "zone-exit" | "attach";

export interface PrimitiveOverlayFacePlan {
  kind: SimulatorPrimitiveOverlayKind;
  entity: SimulatorEntity;
  sourceFace: SimulatorAnimationCardFace;
  destinationFace: SimulatorAnimationCardFace;
  sourceZone?: SimulatorZone;
  destinationZone?: SimulatorZone;
  targetEntityId?: string;
}

export function isPrimitiveOverlayEvent(
  event: SimulatorAnimationEvent,
): event is SimulatorPrimitiveOverlayEvent {
  return (
    event.primitive === "flipReveal" ||
    event.primitive === "zoneEnter" ||
    event.primitive === "zoneExit" ||
    event.primitive === "attach"
  );
}

export function primitiveOverlayKind(
  event: SimulatorPrimitiveOverlayEvent,
): SimulatorPrimitiveOverlayKind {
  switch (event.primitive) {
    case "flipReveal":
      return "flip-reveal";
    case "zoneEnter":
      return "zone-enter";
    case "zoneExit":
      return "zone-exit";
    case "attach":
      return "attach";
  }
}

export function resolvePrimitiveOverlayFaces(
  event: SimulatorPrimitiveOverlayEvent,
): PrimitiveOverlayFacePlan {
  switch (event.primitive) {
    case "flipReveal": {
      const destinationFace = resolveEntityFace(event.entity, event.zone, event.viewer);
      return {
        kind: primitiveOverlayKind(event),
        entity: event.entity,
        sourceFace: "hidden",
        destinationFace,
        sourceZone: event.zone,
        destinationZone: event.zone,
      };
    }
    case "zoneEnter": {
      const destinationFace = resolveEntityFace(event.entity, event.toZone, event.viewer);
      return {
        kind: primitiveOverlayKind(event),
        entity: event.entity,
        sourceFace: destinationFace,
        destinationFace,
        destinationZone: event.toZone,
      };
    }
    case "zoneExit": {
      const sourceFace = resolveEntityFace(event.entity, event.fromZone, event.viewer);
      return {
        kind: primitiveOverlayKind(event),
        entity: event.entity,
        sourceFace,
        destinationFace: sourceFace,
        sourceZone: event.fromZone,
      };
    }
    case "attach": {
      return {
        kind: primitiveOverlayKind(event),
        entity: event.entity,
        sourceFace: resolveEntityFace(event.entity, event.fromZone, event.viewer),
        destinationFace: resolveEntityFace(event.entity, event.toZone, event.viewer),
        sourceZone: event.fromZone,
        destinationZone: event.toZone,
        targetEntityId: event.targetEntityId,
      };
    }
  }
}

function resolveEntityFace(
  entity: SimulatorEntity,
  zone: SimulatorZone,
  viewer: SimulatorAnimationViewerContext,
): SimulatorAnimationCardFace {
  return resolveAnimationCardFaceForViewer({ entity, zone, viewer });
}
