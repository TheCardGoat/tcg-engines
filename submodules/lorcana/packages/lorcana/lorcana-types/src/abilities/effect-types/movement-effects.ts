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
  AmountExpr,
  CardFilter,
  CardSelectionFilter,
  EffectDuration,
} from "../../expressions";
import type {
  CardTarget,
  CharacterTarget,
  ItemTarget,
  LocationTarget,
  PlayerTarget,
} from "../target-types";

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
  target?: CardTarget;
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: CardSelectionFilter | CardFilter | CardFilter[];
  /** Filter for what can be returned */
  filters?: readonly CardFilter[];
  /** Amount of cards to return */
  amount?: AmountExpr;
  /** Who chooses which card to return */
  chosenBy?: "you" | "opponent" | "TARGET";
}

/**
 * Return random cards from a player's inkwell to their hand.
 *
 * @example "Return 2 cards at random from your inkwell to your hand"
 * @example "Each player returns cards at random from their inkwell to their hand until they have 3 cards left"
 */
export interface ReturnRandomFromInkwellEffect {
  type: "return-random-from-inkwell";
  /** Which player's inkwell to trim (default: CONTROLLER) */
  target?: PlayerTarget;
  /** How many cards to return */
  count?: AmountExpr;
  /** Leave exactly this many cards in the inkwell */
  leave?: number;
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
  target?: PlayerTarget;
  count?: AmountExpr;
  destination?: "hand" | "play" | "top-of-deck";
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: CardSelectionFilter | CardFilter | CardFilter[];
  filters?: readonly CardFilter[];
  /**
   * Convenience cost restriction (e.g. "return an action card with cost 4 or less").
   * Equivalent to a `cost-comparison` entry in `filters`.
   */
  costRestriction?: {
    comparison: "less-or-equal" | "greater-or-equal" | "equal";
    value: number;
  };
}

/**
 * Put into inkwell effect
 *
 * @example "Put the top card of your deck into your inkwell facedown and exerted"
 */
export interface PutIntoInkwellEffect {
  type: "put-into-inkwell";
  source?:
    | "top-of-deck"
    | "hand"
    | "chosen-card-in-play"
    | "chosen-character"
    | "this-card"
    | "discard"
    | "revealed"
    | "deck"
    | CardTarget;
  target?: PlayerTarget | CharacterTarget | "SELF";
  cardType?: CardType;
  exerted?: boolean;
  /** Whether the card is placed facedown in the inkwell */
  facedown?: boolean;
  /** Position in deck to take from */
  position?: "top" | "bottom";
  /** Who chooses the card */
  chosenBy?: "you" | "opponent" | "TARGET";
  /** Player who makes the chooser-decision (alias for chosenBy resolved via target). */
  chooser?: PlayerTarget;
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: CardSelectionFilter | CardFilter | CardFilter[];
  /** Filter for which cards can be chosen (when source is chosen-character etc) */
  filters?: readonly CardFilter[];
  /** Upper bound on how many cards may be placed into the inkwell (e.g. "up to 5"). */
  maxCards?: AmountExpr;
}

/**
 * Put card under another card (Boost mechanic)
 */
export interface PutUnderEffect {
  type: "put-under";
  source: "top-of-deck" | "hand" | "discard" | "this-card";
  under: CharacterTarget | LocationTarget | "self";
  cardType?: CardType;
  faceup?: boolean;
}

/**
 * Shuffle into deck effect
 */
export interface ShuffleIntoDeckEffect {
  type: "shuffle-into-deck";
  target?: CharacterTarget | ItemTarget | LocationTarget | CardTarget | PlayerTarget;
  /** Whose deck to shuffle into */
  intoDeck?: "owner" | "controller";
}

/**
 * Put on bottom of deck
 */
export interface PutOnBottomEffect {
  type: "put-on-bottom";
  target: CharacterTarget | ItemTarget | LocationTarget | CardTarget;
  chooser?: PlayerTarget;
  chosenBy?: "you" | "opponent" | "TARGET";
  ordering?: "player-choice";
  orderBy?: "owner" | "controller";
}

export interface MoveCardsFromUnderEffect {
  type: "move-cards-from-under";
  target?: CharacterTarget | ItemTarget | LocationTarget | CardTarget;
  source?: "target" | "selected" | "snapshot-cards-under";
  destination?: "deck-bottom-random" | "inkwell-facedown-exerted" | "hand" | "under-chosen";
  /** When destination is "under-chosen", specifies what can be chosen */
  underTarget?: CharacterTarget | LocationTarget;
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
  from?:
    | "hand"
    | "discard"
    | "deck"
    | "inkwell"
    | "under-self"
    | "revealed"
    | readonly ("hand" | "discard" | "deck")[];
  cardType?: CardType | "song" | "floodborn";
  costRestriction?: { comparison: "less-or-equal" | "equal"; value: number };
  cost?: "free" | "reduced";
  reducedBy?: AmountExpr;
  /** Character enters play exerted */
  entersExerted?: boolean;
  /** Grants Rush for this turn */
  grantsRush?: boolean;
  /** Banish at end of turn */
  banishAtEndOfTurn?: boolean;
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: CardSelectionFilter | CardFilter | CardFilter[];
  /** Filter for what can be played */
  filters?: readonly CardFilter[];
  /** Whether to play for free (alias for cost: "free") */
  free?: boolean;
  /** Target for the play effect */
  target?: string;
  /**
   * How the card enters play.
   * - "shift": always invokes the full Shift stacking mechanic; requires a legal in-play shift base.
   * - "standard": always plays the card normally without shifting.
   * - "either": the controller chooses at resolution time. If a legal shift base for the chosen
   *   source card is included in the selection, the card is played via Shift; otherwise it falls
   *   back to a standard play. Use for printed text like "play or shift" where the player chooses.
   */
  playMethod?: "shift" | "standard" | "either";
  /** Where to send the card after its effects resolve instead of the default discard */
  afterPlay?: "bottom-of-deck";
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
  /**
   * When true, the source card (the card with the ability) is also moved
   * to the same location, in addition to the selected character(s).
   *
   * @example Tuk Tuk - Lively Partner: "move him and one of your other characters to the same location"
   */
  includeSelf?: boolean;
  /**
   * Sub-effects to execute once for each character that was successfully moved.
   *
   * @example Moana - Kakamora Leader: "Gain 1 lore for each character you moved."
   * forEach: [{ type: "gain-lore", amount: 1 }]
   */
  forEach?: ReadonlyArray<{ type: string; [key: string]: unknown }>;
}

/**
 * Move cost reduction effect for locations
 *
 * @example "Your characters named Robin Hood may move here for free"
 * @example "Your Pirate characters may move here for free"
 * @example "Once during your turn, you may pay 1 less to move this character to a location."
 */
export interface MoveCostReductionEffect {
  type: "move-cost-reduction";
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: CardSelectionFilter | CardFilter | CardFilter[];
  /** Filter for which characters get the reduction */
  filters?: readonly CardFilter[];
  /** How much to reduce the cost (0 = free) */
  reduction: AmountExpr | "free";
  /** Target location (usually "here" for location abilities) */
  location?: "here" | LocationTarget;
  /**
   * When "SELF", the reduction applies only when the card that has this ability
   * is the character being moved (self-targeting reduction).
   *
   * @example Raksha - Fearless Mother: "you may pay 1 less to move this character to a location"
   */
  target?: "SELF";
}

/**
 * Grant abilities to characters while at this location
 *
 * @example "Characters gain Ward while here"
 * @example "Characters gain Ward and activated ability while here"
 */
export interface GrantAbilitiesWhileHereEffect {
  type: "grant-abilities-while-here";
  target?: CharacterTarget;
  abilities: (
    | { type: "keyword"; keyword: string; value?: number }
    | {
        type: "activated";
        name?: string;
        text?: string;
        id?: string;
        cost: { exert?: boolean; ink?: number };
        effect: {
          type: string;
          amount?: AmountExpr;
          target?: unknown;
          [key: string]: unknown;
        };
      }
  )[];
}
