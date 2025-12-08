/**
 * Deck Validation Types (Rule 2.1)
 *
 * Deck rules:
 * - Minimum 60 cards (Rule 2.1.1.1)
 * - Maximum 2 ink types (Rule 2.1.1.2)
 * - Maximum 4 copies per full name (Rule 2.1.1.3)
 */

import type { InkType } from "./ink-types";

/** Minimum cards required in a deck */
export const MIN_DECK_SIZE = 60;

/** Maximum different ink types allowed in a deck */
export const MAX_INK_TYPES = 2;

/** Maximum copies of the same card (by full name) allowed */
export const MAX_COPIES_PER_CARD = 4;

/**
 * Deck validation error types
 */
export type DeckValidationError =
  | TooFewCardsError
  | TooManyInkTypesError
  | TooManyCopiesError;

export interface TooFewCardsError {
  type: "TOO_FEW_CARDS";
  count: number;
  minimum: typeof MIN_DECK_SIZE;
}

export interface TooManyInkTypesError {
  type: "TOO_MANY_INK_TYPES";
  inkTypes: InkType[];
  maximum: typeof MAX_INK_TYPES;
}

export interface TooManyCopiesError {
  type: "TOO_MANY_COPIES";
  fullName: string;
  count: number;
  maximum: number;
}

/**
 * Result of deck validation
 */
export interface DeckValidationResult {
  valid: boolean;
  errors: DeckValidationError[];
}

/**
 * Deck statistics for informational purposes
 */
export interface DeckStats {
  totalCards: number;
  inkTypes: InkType[];
  cardCounts: Map<string, number>;
  cardTypeBreakdown: {
    characters: number;
    actions: number;
    items: number;
    locations: number;
  };
  inkableCards: number;
  averageCost: number;
}
