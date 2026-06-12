import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

export type SimulatorAnimationPrimitive =
  | "zoneTransfer"
  | "draw"
  | "flipReveal"
  | "zoneEnter"
  | "zoneExit"
  | "attach"
  | "effectTarget"
  | "layoutShift";

export type SimulatorAnimationCardFace = "public" | "hidden";

export type SimulatorAnimationReducedMotionBehavior = "instant" | "short";

export interface SimulatorAnimationViewerContext {
  viewerSeatId: string | null;
  revealedEntityIds?: readonly string[];
}

export interface SimulatorAnimationBaseEvent {
  id: string;
  primitive: SimulatorAnimationPrimitive;
  viewer: SimulatorAnimationViewerContext;
  delayMs?: number;
  durationMs?: number;
  reducedMotion?: SimulatorAnimationReducedMotionBehavior;
}

export interface SimulatorZoneTransferEvent extends SimulatorAnimationBaseEvent {
  primitive: "zoneTransfer" | "draw";
  entity: SimulatorEntity;
  fromZone: SimulatorZone;
  toZone: SimulatorZone;
}

export interface SimulatorFlipRevealEvent extends SimulatorAnimationBaseEvent {
  primitive: "flipReveal";
  entity: SimulatorEntity;
  zone: SimulatorZone;
}

export interface SimulatorZoneEnterEvent extends SimulatorAnimationBaseEvent {
  primitive: "zoneEnter";
  entity: SimulatorEntity;
  toZone: SimulatorZone;
}

export interface SimulatorZoneExitEvent extends SimulatorAnimationBaseEvent {
  primitive: "zoneExit";
  entity: SimulatorEntity;
  fromZone: SimulatorZone;
}

export interface SimulatorAttachEvent extends SimulatorAnimationBaseEvent {
  primitive: "attach";
  entity: SimulatorEntity;
  fromZone: SimulatorZone;
  toZone: SimulatorZone;
  targetEntityId: string;
}

export type SimulatorEffectTargetSpec =
  | {
      kind: "entity";
      entityId: string;
      zone?: SimulatorZone;
      label?: string;
    }
  | {
      kind: "zone";
      zone: SimulatorZone;
      label?: string;
    }
  | {
      kind: "player";
      seatId: string;
      label?: string;
    };

export interface SimulatorEffectTargetEvent extends SimulatorAnimationBaseEvent {
  primitive: "effectTarget";
  sourceEntity: SimulatorEntity;
  sourceZone?: SimulatorZone;
  targets: readonly SimulatorEffectTargetSpec[];
}

export interface SimulatorLayoutShiftEvent extends SimulatorAnimationBaseEvent {
  primitive: "layoutShift";
  entityIds: readonly string[];
}

export type SimulatorAnimationEvent =
  | SimulatorZoneTransferEvent
  | SimulatorFlipRevealEvent
  | SimulatorZoneEnterEvent
  | SimulatorZoneExitEvent
  | SimulatorAttachEvent
  | SimulatorEffectTargetEvent
  | SimulatorLayoutShiftEvent;

export interface ResolveAnimationCardFaceInput {
  entity: Pick<SimulatorEntity, "id" | "ownerId">;
  zone: Pick<SimulatorZone, "ownerId" | "visibility">;
  viewer: SimulatorAnimationViewerContext | string;
}

export function resolveAnimationCardFaceForViewer({
  entity,
  zone,
  viewer,
}: ResolveAnimationCardFaceInput): SimulatorAnimationCardFace {
  const viewerContext = normalizeAnimationViewerContext(viewer);

  if (zone.visibility === "public") {
    return "public";
  }

  if (zone.visibility === "secret") {
    return viewerContext.revealedEntityIds?.includes(entity.id) ? "public" : "hidden";
  }

  const ownerId = zone.ownerId ?? entity.ownerId;
  return ownerId === viewerContext.viewerSeatId ? "public" : "hidden";
}

export function redactEntityForHiddenZone(
  entity: SimulatorEntity,
  redactedId = `${entity.id}:hidden`,
): SimulatorEntity {
  return {
    ...entity,
    id: redactedId,
    title: "Hidden card",
    subtitle: "Private information",
    kind: "card",
    face: "hidden",
    states: [],
    imageUrl: undefined,
    backImageUrl: entity.backImageUrl,
    stats: [],
    traits: [],
    frameStyle: undefined,
    overlayBadges: undefined,
    spawnAnimation: undefined,
  };
}

export function projectEntityForZoneViewer(
  entity: SimulatorEntity,
  zone: SimulatorZone,
  viewer: SimulatorAnimationViewerContext | string,
): SimulatorEntity {
  return resolveAnimationCardFaceForViewer({ entity, zone, viewer }) === "public"
    ? { ...entity, face: "public" }
    : redactEntityForHiddenZone(entity);
}

function normalizeAnimationViewerContext(
  viewer: SimulatorAnimationViewerContext | string,
): SimulatorAnimationViewerContext {
  return typeof viewer === "string" ? { viewerSeatId: viewer } : viewer;
}
