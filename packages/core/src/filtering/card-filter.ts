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
 * Card filter for declarative card selection
 * All filter properties are optional and combined with AND logic
 */
export type CardFilter<TGameState = unknown> = {
  // Zone filtering
  /** Filter by zone(s) where the card is located */
  zone?: ZoneId | ZoneId[];

  /** Filter by card owner(s) */
  owner?: PlayerId | PlayerId[];

  /** Filter by card controller(s) */
  controller?: PlayerId | PlayerId[];

  // Card properties (from definition)
  /** Filter by card type(s) (e.g., 'creature', 'instant', 'sorcery') */
  type?: string | string[];

  /** Filter by card subtype(s) (e.g., 'dragon', 'elf', 'goblin') */
  subtype?: string | string[];

  /** Filter by card name (exact string or regex pattern) */
  name?: string | RegExp;

  /** Filter by card cost */
  cost?: NumberFilter;

  // Game-specific properties (computed from card + state)
  /** Filter by card power (for creatures) */
  power?: NumberFilter;

  /** Filter by card toughness (for creatures) */
  toughness?: NumberFilter;

  /** Filter by loyalty (for planeswalkers) */
  loyalty?: NumberFilter;

  // State filtering
  /** Filter by tapped state */
  tapped?: boolean;

  /** Filter by revealed state */
  revealed?: boolean;

  /** Filter cards that have specific counter type */
  hasCounters?: string;

  // Composite filters
  /** All filters must match (AND logic) */
  and?: CardFilter<TGameState>[];

  /** At least one filter must match (OR logic) */
  or?: CardFilter<TGameState>[];

  /** Filter must NOT match (NOT logic) */
  not?: CardFilter<TGameState>;

  // Custom predicates
  /** Custom filter function for complex logic */
  where?: (card: CardInstance, state: TGameState) => boolean;
};
