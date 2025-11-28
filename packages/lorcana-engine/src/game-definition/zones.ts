/**
 * Lorcana Zone Configurations
 *
 * Task 1.4: Define all 5 zones for Disney Lorcana
 *
 * Zone properties follow Comprehensive Rules Section 8:
 * - visibility: "owner" (private) or "all" (public)
 * - ordered: true if card order matters, false if can rearrange
 * - facedown: true if cards not visible even to owner
 *
 * References:
 * - Rule 8.1.2 (Public zones - all can see/count)
 * - Rule 8.1.3 (Private zones - only owner can see)
 * - Rule 8.2 (Deck - private, ordered, facedown)
 * - Rule 8.3 (Hand - private, can rearrange)
 * - Rule 8.4 (Play - public, all can see)
 * - Rule 8.5 (Inkwell - private, facedown, can arrange)
 * - Rule 8.6 (Discard - public, ordered, faceup)
 */

/**
 * Lorcana Zone visibility types
 *
 * - "owner": Private zone - only owner can see cards (Rule 8.1.3)
 * - "all": Public zone - all players can see cards (Rule 8.1.2)
 *
 * Note: This is different from core's ZoneVisibility which uses "private"/"public"/"secret"
 */
export type LorcanaZoneVisibility = "owner" | "all";

/**
 * Lorcana Zone configuration
 *
 * Defines properties for each zone type in Lorcana.
 * This is a simpler version of core's ZoneConfig, tailored to Lorcana's rule structure.
 */
export type LorcanaZoneConfig = {
  /**
   * Who can see cards in this zone
   *
   * - "owner": Only the owner can see (private)
   * - "all": All players can see (public)
   */
  visibility: LorcanaZoneVisibility;

  /**
   * Whether card order matters
   *
   * - true: Order is significant (e.g., deck, discard)
   * - false: Can rearrange freely (e.g., hand, play)
   */
  ordered: boolean;

  /**
   * Whether cards are facedown
   *
   * - true: Cards not visible even to owner (e.g., deck, inkwell)
   * - false: Cards are visible to appropriate players
   */
  facedown: boolean;
};

/**
 * Lorcana zone identifiers
 *
 * The 5 zones in Disney Lorcana (Rule 8)
 */
export type LorcanaZoneId =
  | "deck"
  | "hand"
  | "play"
  | "discard"
  | "inkwell"
  | "limbo";

/**
 * Lorcana Zone Configurations
 *
 * Complete zone definitions for Disney Lorcana following Comprehensive Rules Section 8.
 *
 * @example
 * ```typescript
 * // Check if deck is private
 * if (lorcanaZones.deck.visibility === "owner") {
 *   // Only owner can see deck cards
 * }
 *
 * // Check if discard maintains order
 * if (lorcanaZones.discard.ordered) {
 *   // Card order matters in discard
 * }
 * ```
 */
export const lorcanaZones: Record<LorcanaZoneId, LorcanaZoneConfig> = {
  /**
   * Deck Zone
   *
   * Rule 8.2: Player's deck of cards to draw from
   * - Private zone (Rule 8.2.2)
   * - Ordered (cards remain in sequence)
   * - Facedown (cannot look at)
   *
   * Key Rules:
   * - 8.2.2: Cards remain facedown at all times
   * - 8.2.2: Players can count cards but not see them
   * - 8.2.3: Draw from top of deck
   * - 3.2.1.2: Attempting to draw from empty deck = loss
   */
  deck: {
    visibility: "owner",
    ordered: true,
    facedown: true,
  },

  /**
   * Hand Zone
   *
   * Rule 8.3: Where drawn cards are held
   * - Private zone (Rule 8.3.2)
   * - Unordered (can rearrange freely)
   * - Not facedown (owner can see)
   *
   * Key Rules:
   * - 8.3.2: Can't look at opponent's hand
   * - 8.3.2: Can rearrange your own hand
   * - 8.3.3: No maximum hand size
   * - 8.3.4: Discard means choose from hand
   */
  hand: {
    visibility: "owner",
    ordered: false,
    facedown: false,
  },

  /**
   * Play Zone
   *
   * Rule 8.4: Where characters, items, and locations are played
   * - Public zone (Rule 8.4.3)
   * - Unordered (no specific arrangement)
   * - Not facedown (all can see)
   *
   * Key Rules:
   * - 8.4.1: Only characters, items, locations can be here
   * - 8.4.2: Only cards here are "in play"
   * - 8.4.3: All players can look at and count cards
   * - 8.4.4: Leaving play may trigger abilities
   */
  play: {
    visibility: "all",
    ordered: false,
    facedown: false,
  },

  /**
   * Discard Zone
   *
   * Rule 8.6: Where banished cards and resolved actions go
   * - Public zone (Rule 8.6.3)
   * - Ordered (maintain sequence)
   * - Not facedown (all can see)
   *
   * Key Rules:
   * - 8.6.2: Banished cards and actions go here
   * - 8.6.3: Cards remain faceup
   * - 8.6.3: Can look at and count anytime
   * - 8.6.3: Owner can rearrange their own discard
   * - 8.6.4: Multiple cards enter in owner's chosen order
   */
  discard: {
    visibility: "all",
    ordered: true,
    facedown: false,
  },

  /**
   * Inkwell Zone
   *
   * Rule 8.5: Where ink cards are placed to generate resources
   * - Private zone (Rule 8.5.3)
   * - Unordered (can arrange as convenient)
   * - Facedown (cannot look at)
   *
   * Key Rules:
   * - 8.5.1: Each card represents 1 ink
   * - 8.5.2: Cards enter facedown and ready
   * - 8.5.3: Can't look at cards in inkwell (even your own)
   * - 8.5.4: Can arrange physically but stay facedown
   * - 8.5.5: Can put additional cards via effects
   * - 8.5.6: Cards put in don't need inkwell symbol
   * - 4.3.3: Limited to once per turn normally
   */
  inkwell: {
    visibility: "owner",
    ordered: false,
    facedown: true,
  },

  /**
   * Limbo Zone (Phased Out)
   *
   * For cards temporarily out of play:
   * - Shifted cards (the underlying card when another card shifts onto it)
   * - Action cards while resolving their effects
   * - Cards being processed by game mechanics
   *
   * - Private zone (not directly interactable)
   * - Ordered (maintain sequence for stacking)
   * - Not facedown (tracking purposes)
   */
  limbo: {
    visibility: "owner",
    ordered: true,
    facedown: false,
  },
};

/**
 * Type guard to check if a string is a valid Lorcana zone ID
 *
 * @param value - Value to check
 * @returns True if value is a valid LorcanaZoneId
 */
export const isLorcanaZoneId = (value: unknown): value is LorcanaZoneId => {
  return (
    typeof value === "string" &&
    ["deck", "hand", "play", "discard", "inkwell", "limbo"].includes(value)
  );
};

/**
 * Get zone configuration by ID
 *
 * @param zoneId - The zone identifier
 * @returns Zone configuration
 * @throws Error if zoneId is invalid
 */
export const getZoneConfig = (zoneId: string): LorcanaZoneConfig => {
  if (!isLorcanaZoneId(zoneId)) {
    throw new Error(`Invalid zone ID: ${zoneId}`);
  }
  return lorcanaZones[zoneId];
};

/**
 * Check if zone is public (all players can see)
 *
 * @param zoneId - The zone identifier
 * @returns True if zone is public
 */
export const isPublicZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].visibility === "all";
};

/**
 * Check if zone is private (only owner can see)
 *
 * @param zoneId - The zone identifier
 * @returns True if zone is private
 */
export const isPrivateZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].visibility === "owner";
};

/**
 * Check if zone maintains card order
 *
 * @param zoneId - The zone identifier
 * @returns True if zone is ordered
 */
export const isOrderedZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].ordered;
};

/**
 * Check if zone cards are facedown
 *
 * @param zoneId - The zone identifier
 * @returns True if zone is facedown
 */
export const isFacedownZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].facedown;
};
