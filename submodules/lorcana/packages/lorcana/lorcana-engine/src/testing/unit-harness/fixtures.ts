import type { CardInstanceId, PlayerId } from "#core";

export const PLAYER_ONE = "player-one" as PlayerId;
export const PLAYER_TWO = "player-two" as PlayerId;

export type TestCardDefinition = {
  id: string;
  cardType: "character" | "item" | "location" | "action";
  name?: string;
  cost?: number;
  strength?: number;
  willpower?: number;
  lore?: number;
  classifications?: string[];
  actionSubtype?: string;
  abilities?: unknown[];
};

export function zoneKey(zone: string, playerId: PlayerId = PLAYER_ONE): string {
  return `${zone}:${playerId}`;
}

export function asCardId(id: string): CardInstanceId {
  return id as CardInstanceId;
}
