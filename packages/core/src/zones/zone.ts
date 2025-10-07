import type { CardId, PlayerId, ZoneId } from "../types";

/**
 * Zone visibility types
 *
 * - public: All players can see all cards (e.g., play area, graveyard)
 * - private: Owner can see cards, opponents see count (e.g., hand)
 * - secret: No one can see cards, only count (e.g., deck, face-down cards)
 */
export type ZoneVisibility = "public" | "private" | "secret";

/**
 * Zone configuration defining the properties and rules of a zone
 */
export type ZoneConfig = {
  /**
   * Unique identifier for the zone
   */
  id: ZoneId;

  /**
   * Human-readable name of the zone
   */
  name: string;

  /**
   * Visibility rules for the zone
   */
  visibility: ZoneVisibility;

  /**
   * Whether card order matters in this zone
   * True for decks, false for play areas
   */
  ordered: boolean;

  /**
   * Optional owner of the zone (undefined for shared zones)
   */
  owner?: PlayerId;

  /**
   * Whether cards are face-down by default
   */
  faceDown?: boolean;

  /**
   * Maximum number of cards allowed in the zone
   */
  maxSize?: number;
};

/**
 * A zone containing cards with configuration
 */
export type Zone = {
  /**
   * Zone configuration
   */
  config: ZoneConfig;

  /**
   * Cards currently in the zone
   */
  cards: CardId[];
};
