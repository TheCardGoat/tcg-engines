/**
 * Zone Configuration (Section 8)
 *
 * Lorcana has 5 zones with distinct visibility and ordering rules:
 * - Deck (8.2): Private, ordered, facedown
 * - Hand (8.3): Private, unordered
 * - Play (8.4): Public, unordered
 * - Inkwell (8.5): Public count, facedown cards
 * - Discard (8.6): Public, unordered
 */

export const ZONE_IDS = ["deck", "hand", "play", "inkwell", "discard"] as const;
export type LorcanaZoneId = (typeof ZONE_IDS)[number];

export type ZoneVisibility = "public" | "private" | "hidden_identity";

export interface ZoneConfig {
  id: LorcanaZoneId;
  visibility: ZoneVisibility;
  ordered: boolean;
  faceDown: boolean;
  maxSize?: number;
}

/**
 * Zone configurations for Lorcana
 */
export const LORCANA_ZONES: Record<LorcanaZoneId, ZoneConfig> = {
  /**
   * Deck (Rule 8.2)
   * - Private to owner
   * - Ordered (has top and bottom)
   * - Face down
   */
  deck: {
    faceDown: true,
    id: "deck",
    ordered: true,
    visibility: "private",
  },

  /**
   * Hand (Rule 8.3)
   * - Private to owner
   * - Unordered
   * - Face down to opponents
   */
  hand: {
    faceDown: false,
    id: "hand",
    ordered: false,
    visibility: "private",
  },

  /**
   * Play (Rule 8.4)
   * - Public to all players
   * - Unordered
   * - Face up
   */
  play: {
    faceDown: false,
    id: "play",
    ordered: false,
    visibility: "public",
  },

  /**
   * Inkwell (Rule 8.5)
   * - Count is public
   * - Card identity is hidden (facedown)
   * - Unordered
   */
  inkwell: {
    faceDown: true,
    id: "inkwell",
    ordered: false,
    visibility: "hidden_identity",
  },

  /**
   * Discard (Rule 8.6)
   * - Public to all players
   * - Unordered (but order of discard may be tracked)
   * - Face up
   */
  discard: {
    faceDown: false,
    id: "discard",
    ordered: false,
    visibility: "public",
  },
};

/**
 * Check if a zone ID is valid
 */
export function isLorcanaZoneId(value: unknown): value is LorcanaZoneId {
  return typeof value === "string" && ZONE_IDS.includes(value as LorcanaZoneId);
}

/**
 * Get zone configuration by ID
 */
export function getZoneConfig(zoneId: LorcanaZoneId): ZoneConfig {
  return LORCANA_ZONES[zoneId];
}

/**
 * Check if a zone is visible to a specific player
 */
export function isZoneVisibleTo(
  zoneId: LorcanaZoneId,
  zoneOwnerId: string,
  viewerId: string,
): boolean {
  const config = LORCANA_ZONES[zoneId];

  if (config.visibility === "public") {
    return true;
  }

  if (config.visibility === "private") {
    return zoneOwnerId === viewerId;
  }

  // Hidden_identity - count is public, but not the cards themselves
  return false;
}

/**
 * Check if zone card identities are visible to a player
 */
export function areCardsVisibleIn(
  zoneId: LorcanaZoneId,
  zoneOwnerId: string,
  viewerId: string,
): boolean {
  const config = LORCANA_ZONES[zoneId];

  if (config.visibility === "public") {
    return true;
  }

  if (config.visibility === "private" && zoneOwnerId === viewerId) {
    return true;
  }

  return false;
}
