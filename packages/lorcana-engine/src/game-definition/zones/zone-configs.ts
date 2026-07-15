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
    faceDown: true,
    id: "deck" as ZoneId,
    maxSize: 60,
    name: "zones.deck",
    ordered: true,
    owner: undefined,
    visibility: "secret",
  },
  discard: {
    faceDown: false,
    id: "discard" as ZoneId,
    maxSize: undefined,
    name: "zones.discard",
    ordered: false,
    owner: undefined,
    visibility: "public",
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
  inkwell: {
    faceDown: true,
    id: "inkwell" as ZoneId,
    maxSize: undefined,
    name: "zones.inkwell",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
  play: {
    faceDown: false,
    id: "play" as ZoneId,
    maxSize: undefined,
    name: "zones.play",
    ordered: false,
    owner: undefined,
    visibility: "public",
  },
};
