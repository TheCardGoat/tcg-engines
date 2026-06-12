import type { CardZone } from "@tcg/cyberpunk-types";
import type { SimulatorAnimationEvent } from "@tcg/simulator-ui";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { PLAYER_SIDE_TO_ID, type Side } from "../engine";
import type { AnimationScript, AnimationStep } from "./types";

export interface CyberpunkSharedAnimationContext {
  viewerSeatId: string | null;
  resolveEntity: (cardId: string) => SimulatorEntity | null | undefined;
  sideForPlayerId?: (playerId: string) => Side | null;
  idPrefix?: string;
}

const PLAYER_ID_TO_SIDE = new Map<string, Side>([
  [String(PLAYER_SIDE_TO_ID.player), "player"],
  [String(PLAYER_SIDE_TO_ID.opponent), "opponent"],
]);

export function cyberpunkAnimationScriptToSimulatorEvents(
  script: AnimationScript,
  context: CyberpunkSharedAnimationContext,
): SimulatorAnimationEvent[] {
  return script.steps.flatMap(
    (step) => cyberpunkAnimationStepToSimulatorEvent(step, context) ?? [],
  );
}

export function cyberpunkAnimationStepToSimulatorEvent(
  step: AnimationStep,
  context: CyberpunkSharedAnimationContext,
): SimulatorAnimationEvent | null {
  const side = resolveStepSide(step, context);
  if (!side) {
    return null;
  }

  const eventBase = {
    id: context.idPrefix ? `${context.idPrefix}:${step.id}` : step.id,
    viewer: { viewerSeatId: context.viewerSeatId },
    delayMs: step.startMs,
    durationMs: step.durationMs,
  };

  switch (step.kind) {
    case "cardMove": {
      const entity = context.resolveEntity(String(step.cardId));
      if (!entity) {
        return null;
      }
      return {
        ...eventBase,
        primitive: "zoneTransfer",
        entity,
        fromZone: cyberpunkCardZoneToSimulatorZone(step.fromZone, side),
        toZone: cyberpunkCardZoneToSimulatorZone(step.toZone, side),
      };
    }
    case "cardEnter": {
      const entity = context.resolveEntity(String(step.cardId));
      if (!entity) {
        return null;
      }
      if (step.reason === "cardsDrawn" && step.toZone === "hand") {
        return {
          ...eventBase,
          primitive: "draw",
          entity,
          fromZone: cyberpunkCardZoneToSimulatorZone("deck", side),
          toZone: cyberpunkCardZoneToSimulatorZone(step.toZone, side),
        };
      }
      return {
        ...eventBase,
        primitive: "zoneEnter",
        entity,
        toZone: cyberpunkCardZoneToSimulatorZone(step.toZone, side),
      };
    }
    case "cardExit": {
      const entity = context.resolveEntity(String(step.cardId));
      if (!entity) {
        return null;
      }
      return {
        ...eventBase,
        primitive: "zoneExit",
        entity,
        fromZone: cyberpunkCardZoneToSimulatorZone(step.fromZone, side),
      };
    }
    case "cardAttach": {
      const entity = context.resolveEntity(String(step.gearId));
      if (!entity) {
        return null;
      }
      return {
        ...eventBase,
        primitive: "attach",
        entity,
        fromZone: cyberpunkCardZoneToSimulatorZone("hand", side),
        toZone: cyberpunkCardZoneToSimulatorZone("field", side),
        targetEntityId: String(step.hostId),
      };
    }
    case "legendReveal": {
      const entity = context.resolveEntity(String(step.cardId));
      if (!entity) {
        return null;
      }
      return {
        ...eventBase,
        primitive: "flipReveal",
        entity,
        zone: cyberpunkCardZoneToSimulatorZone("legendArea", side),
      };
    }
    case "effectTarget": {
      const sourceEntity = context.resolveEntity(String(step.sourceCardId));
      if (!sourceEntity) {
        return null;
      }
      return {
        ...eventBase,
        primitive: "effectTarget",
        sourceEntity,
        sourceZone: cyberpunkCardZoneToSimulatorZone(currentCardZoneForEntity(sourceEntity), side),
        targets: step.targets.map((target) => {
          switch (target.kind) {
            case "card":
              return { kind: "entity", entityId: String(target.cardId) } as const;
            case "gig":
              return { kind: "entity", entityId: String(target.dieId) } as const;
            case "player":
              return { kind: "player", seatId: String(target.playerId) } as const;
          }
        }),
      };
    }
    case "cardLand":
    case "combat":
    case "gigMove":
    case "phaseChange":
    case "resourceFloat":
      return null;
  }
}

export function isCyberpunkAnimationStepSharedSupported(step: AnimationStep): boolean {
  switch (step.kind) {
    case "cardMove":
    case "cardEnter":
    case "cardExit":
    case "cardAttach":
    case "legendReveal":
    case "effectTarget":
      return true;
    case "cardLand":
    case "combat":
    case "gigMove":
    case "phaseChange":
    case "resourceFloat":
      return false;
  }
}

function currentCardZoneForEntity(entity: SimulatorEntity): CardZone {
  switch (entity.kind) {
    case "unit":
      return "field";
    case "leader":
      return "legendArea";
    default:
      return "trash";
  }
}

export function cyberpunkCardZoneToSimulatorZone(zone: CardZone, side: Side): SimulatorZone {
  const ownerId = String(PLAYER_SIDE_TO_ID[side]);
  const id = cyberpunkZoneAnchorId(zone, side);
  switch (zone) {
    case "deck":
      return zoneDescriptor(id, "Deck", "deck", ownerId, "secret");
    case "hand":
      return zoneDescriptor(id, "Hand", "hand", ownerId, "private");
    case "field":
      return zoneDescriptor(id, "Field", "battlefield", ownerId, "public");
    case "trash":
      return zoneDescriptor(id, "Trash", "discard", ownerId, "public");
    case "legendArea":
      return zoneDescriptor(id, "Legends", "custom", ownerId, "private");
    case "eddieArea":
      return zoneDescriptor(id, "Eddies", "resource", ownerId, "private");
    case "gigArea":
      return zoneDescriptor(id, "Gigs", "resource", ownerId, "public");
  }
}

function cyberpunkZoneAnchorId(zone: CardZone, side: Side): string {
  const prefix = side === "player" ? "p" : "opp";
  switch (zone) {
    case "deck":
      return `${prefix}-deck`;
    case "hand":
      return `${prefix}-hand`;
    case "field":
      return `${prefix}-field`;
    case "trash":
      return `${prefix}-trash`;
    case "legendArea":
      return `${prefix}-legends`;
    case "eddieArea":
      return `${prefix}-eddies`;
    case "gigArea":
      return `${prefix}-gigs`;
  }
}

function zoneDescriptor(
  id: string,
  label: string,
  role: SimulatorZone["role"],
  ownerId: string,
  visibility: SimulatorZone["visibility"],
): SimulatorZone {
  return {
    id,
    label,
    role,
    ownerId,
    visibility,
    entityIds: [],
    hint: label,
  };
}

function resolveStepSide(
  step: AnimationStep,
  context: CyberpunkSharedAnimationContext,
): Side | null {
  switch (step.kind) {
    case "gigMove":
      return sideForPlayerId(String(step.toPlayerId), context);
    default:
      return sideForPlayerId(String(step.playerId), context);
  }
}

function sideForPlayerId(playerId: string, context: CyberpunkSharedAnimationContext): Side | null {
  return context.sideForPlayerId?.(playerId) ?? PLAYER_ID_TO_SIDE.get(playerId) ?? null;
}
