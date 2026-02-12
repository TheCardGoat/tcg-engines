import type { CardZoneConfig, ZoneId } from "@tcg/core";

/**
 * Gundam Zone Configurations
 *
 * Defines all zones where cards can exist during the game.
 * These must match the zones defined in GundamGameState (types.ts).
 */
export const gundamZones: Record<string, CardZoneConfig> = {
  baseSection: {
    faceDown: false,
    id: "baseSection" as ZoneId,
    maxSize: 1,
    name: "zones.baseSection",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  battleArea: {
    faceDown: false,
    id: "battleArea" as ZoneId,
    maxSize: 6,
    name: "zones.battleArea",
    ordered: true,
    owner: undefined,
    visibility: "public",
  },
  deck: {
    faceDown: true,
    id: "deck" as ZoneId,
    maxSize: 60,
    name: "zones.deck",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  hand: {
    faceDown: false,
    id: "hand" as ZoneId,
    maxSize: undefined,
    name: "zones.hand",
    ordered: false,
    owner: undefined,
    visibility: "private",
  },
  limbo: {
    faceDown: false,
    id: "limbo" as ZoneId,
    maxSize: undefined,
    name: "zones.limbo",
    ordered: true,
    owner: undefined,
    visibility: "public",
  },
  removal: {
    faceDown: false,
    id: "removal" as ZoneId,
    maxSize: undefined,
    name: "zones.removal",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  resourceArea: {
    faceDown: false,
    id: "resourceArea" as ZoneId,
    maxSize: 15,
    name: "zones.resourceArea",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  resourceDeck: {
    faceDown: true,
    id: "resourceDeck" as ZoneId,
    maxSize: 10,
    name: "zones.resourceDeck",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  shieldSection: {
    faceDown: true,
    id: "shieldSection" as ZoneId,
    maxSize: undefined,
    name: "zones.shieldSection",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  trash: {
    faceDown: false,
    id: "trash" as ZoneId,
    maxSize: undefined,
    name: "zones.trash",
    ordered: true,
    owner: undefined,
    visibility: "public",
  },
};
