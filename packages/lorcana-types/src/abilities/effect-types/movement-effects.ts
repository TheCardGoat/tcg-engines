/**
 * Movement Effect Types
 *
 * Effects that move cards between zones:
 * - Return to hand
 * - Put into inkwell
 * - Shuffle into deck
 * - Play cards from various zones
 * - Move characters to locations
 */

import type { CardType } from "../../cards/card-types";
import type {
  CardTarget,
  CharacterTarget,
  ItemTarget,
  LocationTarget,
  PlayerTarget,
} from "../target-types";
import type { EffectDuration } from "./amount-types";

// ============================================================================
// Zone Movement Effects
// ============================================================================

/**
 * Return to hand effect
 *
 * @example "Return chosen character to their player's hand"
 */
export interface ReturnToHandEffect {
  type: "return-to-hand";
  target: CardTarget;
}

/**
 * Return from discard to hand
 *
 * @example "Return an action card from your discard to your hand"
 */
export interface ReturnFromDiscardEffect {
  type: "return-from-discard";
  cardType?: CardType | "song";
  cardName?: string;
  target: PlayerTarget;
  count?: number;
}

/**
 * Put into inkwell effect
 *
 * @example "Put the top card of your deck into your inkwell facedown and exerted"
 */
export interface PutIntoInkwellEffect {
  type: "put-into-inkwell";
  source:
    | "top-of-deck"
    | "hand"
    | "chosen-card-in-play"
    | "chosen-character"
    | "this-card"
    | "discard"
    | "revealed"
    | CardTarget;
  target?: PlayerTarget;
  cardType?: CardType;
  exerted?: boolean;
  /** Whether the card is placed facedown in the inkwell */
  facedown?: boolean;
}

/**
 * Put card under another card (Boost mechanic)
 */
export interface PutUnderEffect {
  type: "put-under";
  source: "top-of-deck" | "hand" | "discard";
  under: CharacterTarget | LocationTarget | "self";
  cardType?: CardType;
}

/**
 * Shuffle into deck effect
 */
export interface ShuffleIntoDeckEffect {
  type: "shuffle-into-deck";
  target: CharacterTarget | ItemTarget | LocationTarget | CardTarget;
  /** Whose deck to shuffle into */
  intoDeck?: "owner" | "controller";
}

/**
 * Put on bottom of deck
 */
export interface PutOnBottomEffect {
  type: "put-on-bottom";
  target: CharacterTarget | ItemTarget | LocationTarget;
}

// ============================================================================
// Play Card Effects
// ============================================================================

/**
 * Play a card effect
 *
 * @example "Play a character with cost 3 or less for free"
 * @example "Play a character from your discard for free"
 */
export interface PlayCardEffect {
  type: "play-card";
  from: "hand" | "discard" | "deck" | "under-self";
  cardType?: CardType | "song" | "floodborn";
  costRestriction?: { comparison: "less-or-equal" | "equal"; value: number };
  cost?: "free" | "reduced";
  reducedBy?: number;
  /** Character enters play exerted */
  entersExerted?: boolean;
  /** Grants Rush for this turn */
  grantsRush?: boolean;
  /** Banish at end of turn */
  banishAtEndOfTurn?: boolean;
}

/**
 * Enable playing from under a card
 */
export interface EnablePlayFromUnderEffect {
  type: "enable-play-from-under";
  cardType?: CardType | "song" | "floodborn";
  duration?: EffectDuration;
}

// ============================================================================
// Location Movement Effects
// ============================================================================

/**
 * Move character to location
 *
 * @example "Move a character of yours to a location for free"
 */
export interface MoveToLocationEffect {
  type: "move-to-location";
  character: CharacterTarget;
  location?: LocationTarget;
  cost?: "free" | "normal";
}
