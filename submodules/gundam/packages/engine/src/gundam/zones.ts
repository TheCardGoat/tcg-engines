/**
 * Gundam TCG — Zone Configuration
 *
 * Zone IDs mirror the Zone type from @tcg/gundam-types so that the target DSL
 * and effect system can use the same string values.
 *
 * Layout per player:
 *   deck          Face-down shuffled deck (secret)
 *   hand          Cards in hand (private to owner)
 *   battleArea    Deployed units (public)
 *   baseSection   Deployed bases — base section of shield area (public, max 1)
 *   resourceArea  Resource cards (public — identity and count visible to all players)
 *   shieldArea    Shield cards — shield section of shield area (count public, identity secret)
 *   trash         Discard pile (public, ordered)
 *
 * Global zone:
 *   removalArea   Transitional / removed-from-game zone (public)
 */

import type { ZoneConfig } from "../types/zone-types.ts";

export type GundamZoneId =
  | "deck"
  | "resourceDeck"
  | "hand"
  | "battleArea"
  | "baseSection"
  | "resourceArea"
  | "shieldArea"
  | "trash"
  | "removalArea";

export const gundamZones: Record<GundamZoneId, ZoneConfig> = {
  deck: {
    id: "deck",
    name: "deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
    faceDown: true,
  },
  resourceDeck: {
    id: "resourceDeck",
    name: "Resource Deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
    faceDown: true,
  },
  hand: {
    id: "hand",
    name: "hand",
    visibility: "private",
    ordered: false,
    ownerScoped: true,
  },
  battleArea: {
    id: "battleArea",
    name: "Battle Area",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  baseSection: {
    id: "baseSection",
    name: "Base Section",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  resourceArea: {
    id: "resourceArea",
    name: "Resource Area",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
  },
  shieldArea: {
    id: "shieldArea",
    name: "Shield Area",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
    faceDown: true,
  },
  trash: {
    id: "trash",
    name: "trash",
    visibility: "public",
    ordered: true,
    ownerScoped: true,
  },
  removalArea: {
    id: "removalArea",
    name: "Removal Area",
    visibility: "public",
    ordered: false,
    ownerScoped: false,
  },
} satisfies Record<GundamZoneId, ZoneConfig>;

export function isGundamZoneId(id: string): id is GundamZoneId {
  return id in gundamZones;
}

/**
 * Build the zone key for a player-scoped zone.
 * e.g. zoneKey("battleArea", "player_one") => "battleArea:player_one"
 */
export function zoneKey(zoneId: GundamZoneId, playerId: string): string {
  return `${zoneId}:${playerId}`;
}
