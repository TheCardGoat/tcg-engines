/**
 * Lorcana Runtime Zone Configurations
 *
 * Zone configurations for the new MatchRuntime architecture.
 * Uses the core ZoneConfig type with visibility: "public" | "private" | "secret"
 */

import type { ZoneConfig } from "#core";

/**
 * Lorcana Zone IDs
 */
export type LorcanaZoneId = "deck" | "hand" | "play" | "discard" | "inkwell" | "limbo";

/**
 * Zone configurations for Lorcana using new runtime format
 */
export const lorcanaRuntimeZones: Record<LorcanaZoneId, ZoneConfig> = {
  /**
   * Deck Zone
   * - Secret: Cards are face down, even owner can't see
   * - Ordered: Card sequence matters
   */
  deck: {
    id: "deck",
    name: "Deck",
    visibility: "secret",
    ordered: true,
    ownerScoped: true,
    faceDown: true,
  },

  /**
   * Hand Zone
   * - Private: Only owner can see
   * - Unordered: Can rearrange freely
   */
  hand: {
    id: "hand",
    name: "Hand",
    visibility: "private",
    ordered: false,
    ownerScoped: true,
    faceDown: false,
  },

  /**
   * Play Zone (Battlefield)
   * - Public: All players can see
   * - Unordered: No specific arrangement
   */
  play: {
    id: "play",
    name: "Play",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
    faceDown: false,
  },

  /**
   * Discard Zone
   * - Public: All players can see
   * - Ordered: Sequence matters (top card visible)
   */
  discard: {
    id: "discard",
    name: "Discard",
    visibility: "public",
    ordered: true,
    ownerScoped: true,
    faceDown: false,
  },

  /**
   * Inkwell Zone
   * - Public: Cards face down, both players can see whether the card is tapped or not.
   * - Unordered: Can arrange physically
   */
  inkwell: {
    id: "inkwell",
    name: "Inkwell",
    visibility: "public",
    ordered: false,
    ownerScoped: true,
    faceDown: true,
  },

  /**
   * Limbo Zone (for cards temporarily out of play)
   * - Public: Visible to all players
   * - Ordered: Maintain sequence
   */
  limbo: {
    id: "limbo",
    name: "Limbo",
    visibility: "public",
    ordered: true,
    ownerScoped: true,
    faceDown: false,
  },
};

/**
 * Type guard to check if a string is a valid Lorcana zone ID
 */
export const isLorcanaZoneId = (value: unknown): value is LorcanaZoneId =>
  typeof value === "string" &&
  ["deck", "hand", "play", "discard", "inkwell", "limbo"].includes(value);

/**
 * Get zone configuration by ID
 */
export const getZoneConfig = (zoneId: string): ZoneConfig => {
  if (!isLorcanaZoneId(zoneId)) {
    throw new Error(`Invalid zone ID: ${zoneId}`);
  }
  return lorcanaRuntimeZones[zoneId];
};

/**
 * Check if zone is public (all players can see)
 */
export const isPublicZone = (zoneId: LorcanaZoneId): boolean =>
  lorcanaRuntimeZones[zoneId].visibility === "public";

/**
 * Check if zone is private (only owner can see)
 */
export const isPrivateZone = (zoneId: LorcanaZoneId): boolean =>
  lorcanaRuntimeZones[zoneId].visibility === "private";

/**
 * Check if zone is secret (face down, even owner can't see)
 */
export const isSecretZone = (zoneId: LorcanaZoneId): boolean =>
  lorcanaRuntimeZones[zoneId].visibility === "secret";
