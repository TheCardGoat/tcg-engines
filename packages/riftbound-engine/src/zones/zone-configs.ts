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
    faceDown: true,
    id: "mainDeck" as ZoneId,
    maxSize: 60,
    name: "Main Deck",
    ordered: true,
    visibility: "secret",
  },

  /** Hand - private to owner, unordered */
  hand: {
    faceDown: false,
    id: "hand" as ZoneId,
    name: "Hand",
    ordered: false,
    visibility: "private",
  },

  /** Rune Deck - exactly 12 runes, secret, ordered */
  runeDeck: {
    faceDown: true,
    id: "runeDeck" as ZoneId,
    maxSize: 12,
    name: "Rune Deck",
    ordered: true,
    visibility: "secret",
  },

  /** Rune Pool - channeled runes, public */
  runePool: {
    faceDown: false,
    id: "runePool" as ZoneId,
    name: "Rune Pool",
    ordered: false,
    visibility: "public",
  },

  /** Base - player's home zone for units and gear */
  base: {
    faceDown: false,
    id: "base" as ZoneId,
    name: "Base",
    ordered: false,
    visibility: "public",
  },

  /** Trash - discard pile, public */
  trash: {
    faceDown: false,
    id: "trash" as ZoneId,
    name: "Trash",
    ordered: false,
    visibility: "public",
  },

  /** Banishment - removed from game, public */
  banishment: {
    faceDown: false,
    id: "banishment" as ZoneId,
    name: "Banishment",
    ordered: false,
    visibility: "public",
  },

  /** Legend Zone - Champion Legend, public, max 1 */
  legendZone: {
    faceDown: false,
    id: "legendZone" as ZoneId,
    maxSize: 1,
    name: "Legend Zone",
    ordered: false,
    visibility: "public",
  },

  /** Champion Zone - Chosen Champion before played, public, max 1 */
  championZone: {
    faceDown: false,
    id: "championZone" as ZoneId,
    maxSize: 1,
    name: "Champion Zone",
    ordered: false,
    visibility: "public",
  },

  // ============================================
  // Shared Zones
  // ============================================

  /** Battlefield Row - holds battlefield cards, ordered, max 3 for 1v1 */
  battlefieldRow: {
    faceDown: false,
    id: "battlefieldRow" as ZoneId,
    maxSize: 3,
    name: "Battlefield Row",
    ordered: true,
    visibility: "public",
  },

  /** The Chain - spells and abilities being resolved, LIFO */
  chain: {
    faceDown: false,
    id: "chain" as ZoneId,
    name: "The Chain",
    ordered: true,
    visibility: "public",
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
    faceDown: false,
    id: `battlefield-${battlefieldId}` as ZoneId,
    name: `Battlefield ${battlefieldId}`,
    ordered: false,
    visibility: "public",
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
    faceDown: true,
    id: `facedown-${battlefieldId}` as ZoneId,
    maxSize: 1,
    name: `Facedown at ${battlefieldId}`,
    ordered: false,
    visibility: "private",
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
