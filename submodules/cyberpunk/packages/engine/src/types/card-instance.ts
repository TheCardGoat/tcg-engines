import type { CardDefinition, CardZone } from "@tcg/cyberpunk-types";
import type { CardInstanceId, PlayerId } from "./branded.ts";

export interface CardMeta {
  spent: boolean;
  faceDown: boolean;
  /**
   * Online UX: show this card's face this turn even when rules would hide it
   * (last sold Eddie, looked-at face-down Legend). Cleared at turn end.
   */
  revealed: boolean;
  damage: number;
  powerModifier: number;
  powerMultiplier: number;
  counters: Record<string, number>;
  attachedGearIds: CardInstanceId[];
  attachedToId: CardInstanceId | null;
  hasLag: boolean;
  hasAttackedThisTurn: boolean;
  hasStolenGigThisTurn: boolean;
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
      revealed: false,
      damage: 0,
      powerModifier: 0,
      powerMultiplier: 1,
      counters: {},
      attachedGearIds: [],
      attachedToId: null,
      hasLag: false,
      hasAttackedThisTurn: false,
      hasStolenGigThisTurn: false,
      ...overrides,
    },
  };
}

export function createDefaultMeta(overrides?: Partial<CardMeta>): CardMeta {
  return {
    spent: false,
    faceDown: false,
    revealed: false,
    damage: 0,
    powerModifier: 0,
    powerMultiplier: 1,
    counters: {},
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    hasStolenGigThisTurn: false,
    ...overrides,
  };
}

export function createDefaultMetaForZone(zone: CardZone, overrides?: Partial<CardMeta>): CardMeta {
  return createDefaultMeta({
    faceDown: zone === "legendArea",
    ...overrides,
  });
}
