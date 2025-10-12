import type { CardZoneConfig, ZoneId } from "@tcg/core";

/**
 * Lorcana Zone Configurations
 *
 * Defines all zones where cards can exist during the game:
 * - deck: Player's library of cards
 * - hand: Cards available to play
 * - inkwell: Resource zone for paying costs
 * - play: Active cards in play
 * - discard: Graveyard for used/destroyed cards
 */
export const lorcanaZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 60,
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
  inkwell: {
    id: "inkwell" as ZoneId,
    name: "zones.inkwell",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: true,
    maxSize: undefined,
  },
  play: {
    id: "play" as ZoneId,
    name: "zones.play",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  discard: {
    id: "discard" as ZoneId,
    name: "zones.discard",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};
