/**
 * Scry Effect Types
 *
 * Defines the "look at top X cards" effect system with declarative destinations.
 * Used for effects like "Look at the top 4 cards of your deck..."
 */

import type { CardType } from "../../cards/card-types";
import type { PlayerTarget } from "../target-types";
import type { Amount, VariableAmount } from "./amount-types";

// ============================================================================
// Scry Effect
// ============================================================================

/**
 * Scry effect - Look at top cards and distribute to destinations
 *
 * Replaces the old LookAtCardsEffect with a declarative destinations array.
 *
 * Design principles:
 * 1. Declarative: Describes WHAT happens, not HOW
 * 2. Composable: Multiple independent selections from same pool
 * 3. Parser-friendly: Can be constructed from natural language
 *
 * @example "Look at top 4, reveal a character, put into hand, rest on bottom"
 * @example "Look at top 5, reveal up to 1 Madrigal AND up to 1 song, put in hand"
 */
export interface ScryEffect {
  type: "scry";
  /** Number of cards to look at from top of deck */
  amount: Amount;
  /** Whose deck to look at (default: CONTROLLER) */
  target?: PlayerTarget;
  /** Destinations for the looked-at cards, processed in order */
  destinations: ScryDestination[];
  /** Whether all looked-at cards should be revealed to opponent */
  revealAll?: boolean;
}

// ============================================================================
// Scry Destinations (Discriminated Union)
// ============================================================================

/**
 * A destination describes where cards can go and constraints on the selection.
 * Uses discriminated union on 'zone' property for type safety.
 */
export type ScryDestination =
  | ScryHandDestination
  | ScryDeckTopDestination
  | ScryDeckBottomDestination
  | ScryInkwellDestination
  | ScryPlayDestination
  | ScryDiscardDestination;

/**
 * Base properties shared by all scry destinations
 */
interface ScryBaseDestination {
  /** Minimum cards that MUST go to this destination (default: 0) */
  min?: number;
  /** Maximum cards that CAN go to this destination */
  max?: number;
  /** Filter for which cards can go to this destination */
  filter?: ScryCardFilter | ScryCardFilter[];
  /** Whether cards going here must be revealed to opponent */
  reveal?: boolean;
  /** Mark as remainder destination - receives all unselected cards */
  remainder?: boolean;
  /** Destinations in the same exclusiveGroup are mutually exclusive */
  exclusiveGroup?: string;
  /** Label for UI display (e.g., "up to 1 Madrigal character") */
  label?: string;
}

/** Put cards into hand */
export interface ScryHandDestination extends ScryBaseDestination {
  zone: "hand";
}

/** Put cards on top of deck */
export interface ScryDeckTopDestination extends ScryBaseDestination {
  zone: "deck-top";
  /** How cards are ordered when placed on top */
  ordering?: ScryCardOrdering;
}

/** Put cards on bottom of deck */
export interface ScryDeckBottomDestination extends ScryBaseDestination {
  zone: "deck-bottom";
  /** How cards are ordered when placed on bottom */
  ordering?: ScryCardOrdering;
}

/** Put cards into inkwell */
export interface ScryInkwellDestination extends ScryBaseDestination {
  zone: "inkwell";
  /** Whether ink enters exerted (default: true) */
  exerted?: boolean;
  /** Whether card is facedown (default: true) */
  facedown?: boolean;
}

/** Put cards into play (for "play for free" effects) */
export interface ScryPlayDestination extends ScryBaseDestination {
  zone: "play";
  /** Cost modification when playing */
  cost?: "free" | "reduced";
  /** Amount to reduce cost by (when cost is "reduced") */
  reducedBy?: number;
  /** Additional filter for cost restriction (beyond selection filter) */
  playFilter?: ScryCardFilter | ScryCardFilter[];
  /** Character enters play exerted */
  entersExerted?: boolean;
  /** Grants Rush for this turn */
  grantsRush?: boolean;
  /** Banish at end of turn */
  banishAtEndOfTurn?: boolean;
}

/** Put cards into discard */
export interface ScryDiscardDestination extends ScryBaseDestination {
  zone: "discard";
}

/** How cards are ordered when placed on deck */
export type ScryCardOrdering =
  | "player-choice" // Player decides order
  | "original-order" // Keep original order from look
  | "random"; // Shuffle before placing

// ============================================================================
// Scry Card Filters
// ============================================================================

/** Filters for selecting cards during scry */
export type ScryCardFilter =
  // Card Type Filters
  | ScryCardTypeFilter
  | ScrySongFilter
  | ScryFloodbornFilter
  // Property Filters
  | ScryClassificationFilter
  | ScryNameFilter
  | ScryKeywordFilter
  // Cost Filters
  | ScryCostComparisonFilter
  // Composite Filters
  | ScryAndFilter
  | ScryOrFilter
  | ScryNotFilter;

/** Filter by card type (character, item, action, location) */
export interface ScryCardTypeFilter {
  type: "card-type";
  cardType: CardType;
}

/** Filter for songs specifically (action with song subtype) */
export interface ScrySongFilter {
  type: "song";
}

/** Filter for floodborn characters */
export interface ScryFloodbornFilter {
  type: "floodborn";
}

/** Filter by classification (e.g., "Madrigal", "Puppy", "Princess") */
export interface ScryClassificationFilter {
  type: "classification";
  classification: string;
}

/** Filter by card name */
export interface ScryNameFilter {
  type: "name";
  name: string;
  /** Match mode: exact or contains */
  match?: "exact" | "contains";
}

/** Filter by keyword (e.g., "Bodyguard", "Evasive") */
export interface ScryKeywordFilter {
  type: "keyword";
  keyword: string;
}

/** Filter by cost comparison */
export interface ScryCostComparisonFilter {
  type: "cost-comparison";
  comparison:
    | "less-or-equal"
    | "equal"
    | "greater-or-equal"
    | "less"
    | "greater";
  value: number | VariableAmount;
}

/** AND filter - all sub-filters must match */
export interface ScryAndFilter {
  type: "and";
  filters: ScryCardFilter[];
}

/** OR filter - any sub-filter can match */
export interface ScryOrFilter {
  type: "or";
  filters: ScryCardFilter[];
}

/** NOT filter - inverts the sub-filter */
export interface ScryNotFilter {
  type: "not";
  filter: ScryCardFilter;
}

// ============================================================================
// Scry Type Guards
// ============================================================================

/** Check if destination is a hand destination */
export function isScryHandDestination(
  dest: ScryDestination,
): dest is ScryHandDestination {
  return dest.zone === "hand";
}

/** Check if destination is a deck-top destination */
export function isScryDeckTopDestination(
  dest: ScryDestination,
): dest is ScryDeckTopDestination {
  return dest.zone === "deck-top";
}

/** Check if destination is a deck-bottom destination */
export function isScryDeckBottomDestination(
  dest: ScryDestination,
): dest is ScryDeckBottomDestination {
  return dest.zone === "deck-bottom";
}

/** Check if destination is an inkwell destination */
export function isScryInkwellDestination(
  dest: ScryDestination,
): dest is ScryInkwellDestination {
  return dest.zone === "inkwell";
}

/** Check if destination is a play destination */
export function isScryPlayDestination(
  dest: ScryDestination,
): dest is ScryPlayDestination {
  return dest.zone === "play";
}

/** Check if destination is a discard destination */
export function isScryDiscardDestination(
  dest: ScryDestination,
): dest is ScryDiscardDestination {
  return dest.zone === "discard";
}

/** Check if destination is a remainder destination */
export function isScryRemainderDestination(dest: ScryDestination): boolean {
  return dest.remainder === true;
}
