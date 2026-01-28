/**
 * Riftbound Zone Configurations
 *
 * Defines all zones used in Riftbound TCG.
 * Follows the official Riftbound zone structure from the Core Rules.
 */

import type { CardZoneConfig, ZoneId } from "@tcg/core";
import type { CardId } from "../types";

/**
 * Zone visibility types
 */
export type ZoneVisibility = "public" | "private" | "secret";

/**
 * All Riftbound zone IDs
 */
export type RiftboundZoneId =
  // Per-player zones
  | "mainDeck"
  | "hand"
  | "runeDeck"
  | "runePool"
  | "base"
  | "trash"
  | "banishment"
  | "legendZone"
  | "championZone"
  // Shared zones
  | "battlefieldRow"
  | "chain";

/**
 * Zone configurations for Riftbound
 *
 * These define the static zones. Dynamic zones (per-battlefield)
 * are created using the factory functions below.
 */
export const riftboundZones: Record<string, CardZoneConfig> = {
  // ============================================
  // Per-Player Zones
  // ============================================

  /** Main Deck - 40+ cards, secret, ordered */
  mainDeck: {
    id: "mainDeck" as ZoneId,
    name: "Main Deck",
    visibility: "secret",
    ordered: true,
    faceDown: true,
    maxSize: 60,
  },

  /** Hand - private to owner, unordered */
  hand: {
    id: "hand" as ZoneId,
    name: "Hand",
    visibility: "private",
    ordered: false,
    faceDown: false,
  },

  /** Rune Deck - exactly 12 runes, secret, ordered */
  runeDeck: {
    id: "runeDeck" as ZoneId,
    name: "Rune Deck",
    visibility: "secret",
    ordered: true,
    faceDown: true,
    maxSize: 12,
  },

  /** Rune Pool - channeled runes, public */
  runePool: {
    id: "runePool" as ZoneId,
    name: "Rune Pool",
    visibility: "public",
    ordered: false,
    faceDown: false,
  },

  /** Base - player's home zone for units and gear */
  base: {
    id: "base" as ZoneId,
    name: "Base",
    visibility: "public",
    ordered: false,
    faceDown: false,
  },

  /** Trash - discard pile, public */
  trash: {
    id: "trash" as ZoneId,
    name: "Trash",
    visibility: "public",
    ordered: false,
    faceDown: false,
  },

  /** Banishment - removed from game, public */
  banishment: {
    id: "banishment" as ZoneId,
    name: "Banishment",
    visibility: "public",
    ordered: false,
    faceDown: false,
  },

  /** Legend Zone - Champion Legend, public, max 1 */
  legendZone: {
    id: "legendZone" as ZoneId,
    name: "Legend Zone",
    visibility: "public",
    ordered: false,
    faceDown: false,
    maxSize: 1,
  },

  /** Champion Zone - Chosen Champion before played, public, max 1 */
  championZone: {
    id: "championZone" as ZoneId,
    name: "Champion Zone",
    visibility: "public",
    ordered: false,
    faceDown: false,
    maxSize: 1,
  },

  // ============================================
  // Shared Zones
  // ============================================

  /** Battlefield Row - holds battlefield cards, ordered, max 3 for 1v1 */
  battlefieldRow: {
    id: "battlefieldRow" as ZoneId,
    name: "Battlefield Row",
    visibility: "public",
    ordered: true,
    faceDown: false,
    maxSize: 3,
  },

  /** The Chain - spells and abilities being resolved, LIFO */
  chain: {
    id: "chain" as ZoneId,
    name: "The Chain",
    visibility: "public",
    ordered: true,
    faceDown: false,
  },
};

/**
 * Create a battlefield zone for units at a specific battlefield
 *
 * Each battlefield has its own zone where units can be placed.
 *
 * @param battlefieldId - The battlefield card ID
 * @returns Zone configuration for the battlefield
 */
export function createBattlefieldZone(battlefieldId: CardId): CardZoneConfig {
  return {
    id: `battlefield-${battlefieldId}` as ZoneId,
    name: `Battlefield ${battlefieldId}`,
    visibility: "public",
    ordered: false,
    faceDown: false,
  };
}

/**
 * Create a facedown zone for a specific battlefield
 *
 * Each battlefield has one facedown zone for Hidden cards.
 * Only the controller can place cards here.
 *
 * @param battlefieldId - The battlefield card ID
 * @returns Zone configuration for the facedown zone
 */
export function createFacedownZone(battlefieldId: CardId): CardZoneConfig {
  return {
    id: `facedown-${battlefieldId}` as ZoneId,
    name: `Facedown at ${battlefieldId}`,
    visibility: "private",
    ordered: false,
    faceDown: true,
    maxSize: 1,
  };
}

/**
 * Get the battlefield zone ID for a battlefield card
 *
 * @param battlefieldId - The battlefield card ID
 * @returns The zone ID for units at this battlefield
 */
export function getBattlefieldZoneId(battlefieldId: CardId): ZoneId {
  return `battlefield-${battlefieldId}` as ZoneId;
}

/**
 * Get the facedown zone ID for a battlefield card
 *
 * @param battlefieldId - The battlefield card ID
 * @returns The zone ID for hidden cards at this battlefield
 */
export function getFacedownZoneId(battlefieldId: CardId): ZoneId {
  return `facedown-${battlefieldId}` as ZoneId;
}

/**
 * Check if a zone ID is a battlefield zone
 *
 * @param zoneId - The zone ID to check
 * @returns true if this is a battlefield zone
 */
export function isBattlefieldZone(zoneId: string): boolean {
  return zoneId.startsWith("battlefield-");
}

/**
 * Check if a zone ID is a facedown zone
 *
 * @param zoneId - The zone ID to check
 * @returns true if this is a facedown zone
 */
export function isFacedownZone(zoneId: string): boolean {
  return zoneId.startsWith("facedown-");
}

/**
 * Extract the battlefield ID from a battlefield or facedown zone ID
 *
 * @param zoneId - The zone ID
 * @returns The battlefield card ID, or null if not a battlefield/facedown zone
 */
export function extractBattlefieldId(zoneId: string): CardId | null {
  if (zoneId.startsWith("battlefield-")) {
    return zoneId.slice("battlefield-".length) as CardId;
  }
  if (zoneId.startsWith("facedown-")) {
    return zoneId.slice("facedown-".length) as CardId;
  }
  return null;
}

/**
 * Check if a zone is public (visible to all players)
 *
 * @param zoneId - The zone ID
 * @returns true if the zone is public
 */
export function isPublicZone(zoneId: string): boolean {
  const config = riftboundZones[zoneId];
  if (config) {
    return config.visibility === "public";
  }
  // Battlefield zones are public, facedown zones are private
  if (isBattlefieldZone(zoneId)) {
    return true;
  }
  if (isFacedownZone(zoneId)) {
    return false;
  }
  return false;
}

/**
 * Check if a zone is a location (Base or Battlefield)
 *
 * Locations are where units can exist on the board.
 *
 * @param zoneId - The zone ID
 * @returns true if the zone is a location
 */
export function isLocation(zoneId: string): boolean {
  return zoneId === "base" || isBattlefieldZone(zoneId);
}
