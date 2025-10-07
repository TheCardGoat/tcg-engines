import type { CardInstance } from "../cards/card-instance";
import type { PlayerId, ZoneId } from "../types";

/**
 * Number filter for numerical comparisons
 * Can be a direct number (exact match) or an object with comparison operators
 */
export type NumberFilter =
  | number // exact match
  | { eq: number } // equal
  | { gte: number } // greater than or equal
  | { lte: number } // less than or equal
  | { gt: number } // greater than
  | { lt: number } // less than
  | { between: [number, number] }; // range [min, max]

/**
 * String filter for text comparisons
 */
export type StringFilter = string | RegExp | string[];

/**
 * Generic property filter that can match any value type
 */
export type PropertyFilter<T = any> =
  | T // exact match
  | { eq: T } // equal
  | (T extends number ? NumberFilter : never) // numeric operations only for numbers
  | (T extends string ? StringFilter : never); // string operations only for strings

/**
 * Core card filter - only properties ALL cards have
 * All filter properties are optional and combined with AND logic
 * @template TGameState - The game state type
 */
export type CardFilter<TGameState = unknown> = {
  // Universal card properties (all TCGs have these)
  /** Filter by zone(s) where the card is located */
  zone?: ZoneId | ZoneId[];

  /** Filter by card owner(s) */
  owner?: PlayerId | PlayerId[];

  /** Filter by card controller(s) */
  controller?: PlayerId | PlayerId[];

  /** Filter by card type(s) - all games have card types */
  type?: string | string[];

  /** Filter by card name (exact string or regex pattern) */
  name?: string | RegExp;

  // State filtering (from CardInstanceBase)
  /** Filter by tapped/exhausted state */
  tapped?: boolean;

  /** Filter by revealed state */
  revealed?: boolean;

  /** Filter by flipped/face-down state */
  flipped?: boolean;

  /** Filter by phased state */
  phased?: boolean;

  // Extensible property filtering
  /**
   * Filter by properties from the card definition
   * Allows filtering on any game-specific property like:
   * - MTG: { basePower: 5, baseToughness: { gte: 3 } }
   * - Pokemon: { hp: { gte: 100 }, weakness: "Fire" }
   * - Lorcana: { inkCost: { lte: 3 }, strength: 2 }
   */
  properties?: Record<string, PropertyFilter>;

  // Composite filters
  /** All filters must match (AND logic) */
  and?: CardFilter<TGameState>[];

  /** At least one filter must match (OR logic) */
  or?: CardFilter<TGameState>[];

  /** Filter must NOT match (NOT logic) */
  not?: CardFilter<TGameState>;

  // Custom predicates
  /** Custom filter function for complex logic */
  where?: TGameState extends { cards: Record<string, infer TCard> }
    ? (card: TCard, state: TGameState) => boolean
    : (card: CardInstance<unknown>, state: TGameState) => boolean;
};
