import type { CardDefinition, CardZone } from "@tcg/cyberpunk-types";
import type { CardInstanceId, PlayerId } from "./branded.ts";

export interface CardMeta {
  spent: boolean;
  faceDown: boolean;
  damage: number;
  powerModifier: number;
  powerMultiplier: number;
  counters: Record<string, number>;
  attachedGearIds: CardInstanceId[];
  attachedToId: CardInstanceId | null;
  playedThisTurn: boolean;
  hasAttackedThisTurn: boolean;
}

export interface CardInstance {
  instanceId: CardInstanceId;
  definitionId: string;
  ownerId: PlayerId;
  controllerId: PlayerId;
  zone: CardZone;
  meta: CardMeta;
}

export function createCardInstance(
  instanceId: CardInstanceId,
  definition: CardDefinition,
  ownerId: PlayerId,
  zone: CardZone,
  overrides?: Partial<CardMeta>,
): CardInstance {
  return {
    instanceId,
    definitionId: definition.id,
    ownerId,
    controllerId: ownerId,
    zone,
    meta: {
      spent: false,
      faceDown: zone === "legendArea",
      damage: 0,
      powerModifier: 0,
      powerMultiplier: 1,
      counters: {},
      attachedGearIds: [],
      attachedToId: null,
      playedThisTurn: false,
      hasAttackedThisTurn: false,
      ...overrides,
    },
  };
}

export function createDefaultMeta(overrides?: Partial<CardMeta>): CardMeta {
  return {
    spent: false,
    faceDown: false,
    damage: 0,
    powerModifier: 0,
    powerMultiplier: 1,
    counters: {},
    attachedGearIds: [],
    attachedToId: null,
    playedThisTurn: false,
    hasAttackedThisTurn: false,
    ...overrides,
  };
}

export function createDefaultMetaForZone(zone: CardZone, overrides?: Partial<CardMeta>): CardMeta {
  return createDefaultMeta({
    faceDown: zone === "legendArea",
    ...overrides,
  });
}
