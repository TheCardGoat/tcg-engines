import type { CardZoneConfig, ZoneId } from "@tcg/core";

/**
 * Gundam Zone Configurations
 *
 * Defines all zones where cards can exist during the game.
 * These must match the zones defined in GundamGameState (types.ts).
 */
export const gundamZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 60,
  },
  resourceDeck: {
    id: "resourceDeck" as ZoneId,
    name: "zones.resourceDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 10,
  },
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  battleArea: {
    id: "battleArea" as ZoneId,
    name: "zones.battleArea",
    visibility: "public",
    ordered: true,
    owner: undefined,
    faceDown: false,
    maxSize: 6,
  },
  shieldSection: {
    id: "shieldSection" as ZoneId,
    name: "zones.shieldSection",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: undefined,
  },
  baseSection: {
    id: "baseSection" as ZoneId,
    name: "zones.baseSection",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  resourceArea: {
    id: "resourceArea" as ZoneId,
    name: "zones.resourceArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 15,
  },
  trash: {
    id: "trash" as ZoneId,
    name: "zones.trash",
    visibility: "public",
    ordered: true,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  removal: {
    id: "removal" as ZoneId,
    name: "zones.removal",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  limbo: {
    id: "limbo" as ZoneId,
    name: "zones.limbo",
    visibility: "public",
    ordered: true,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};
