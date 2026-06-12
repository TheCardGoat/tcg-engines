/**
 * Basic Effect Types
 *
 * Core effect types for common game actions:
 * - Draw/Discard cards
 * - Deal/Remove damage
 * - Gain/Lose lore
 * - Exert/Ready/Banish cards
 */

import type { AmountExpr, CardSelectionFilter } from "../../expressions";
import type {
  CardFilter,
  CardTarget,
  CharacterTarget,
  ItemTarget,
  LocationTarget,
  PlayerTarget,
  TargetZone,
} from "../target-types";
import type { LorcanaPlayerTarget } from "../../targeting/lorcana-target-dsl";
import type { Condition } from "../condition-types";

export type SelfReplacementCondition =
  | {
      type: "selected-target-name";
      name: string;
    }
  | {
      type: "trigger-subject-classification";
      classification: string;
    }
  | {
      type: "trigger-subject-strength-gte";
      value: number;
    }
  | {
      /**
       * Evaluates a general `Condition` against the current game state.
       *
       * Used for self-replacement triggers whose branching depends on game state
       * rather than on the trigger subject/target (e.g. "If 2 or more cards were
       * put into your discard this turn, deal 2 damage instead").
       */
      type: "condition";
      condition: Condition;
    };

export interface NumericSelfReplacement {
  condition: SelfReplacementCondition;
  value: number;
  applicationKey?: string;
}

// ============================================================================
// Draw/Discard Effects
// ============================================================================

/**
 * Draw cards effect
 *
 * @example "Draw 2 cards"
 * @example "Each player draws a card"
 */
export interface DrawEffect {
  type: "draw";
  amount?: AmountExpr;
  target?: PlayerTarget | LorcanaPlayerTarget;
}

/**
 * Discard cards effect
 *
 * @example "Choose and discard a card"
 * @example "Each opponent discards a card at random"
 */
export interface DiscardEffect {
  type: "discard";
  amount?: AmountExpr;
  target?: PlayerTarget | LorcanaPlayerTarget;
  /** Whether the affected player chooses which cards */
  chosen?: boolean;
  /** Who chooses (alternative to chosen) */
  chosenBy?: "you" | "opponent" | "TARGET";
  /** If not chosen, discard is random */
  random?: boolean;
  /** Discard from specific zone (default: hand) */
  from?: TargetZone;
  /** Legacy singular filter entrypoint. Prefer `filters`. */
  filter?: CardSelectionFilter | CardFilter | CardFilter[];
  /** Filter for what can be discarded */
  filters?: readonly CardFilter[];
}

/**
 * Put the top cards of a player's deck into their discard.
 *
 * @example "Each opponent puts the top 2 cards of their deck into their discard."
 * @example "Chosen player puts the top card of their deck into their discard."
 */
export interface MillEffect {
  type: "mill";
  amount: AmountExpr;
  target?: PlayerTarget | LorcanaPlayerTarget;
}

// ============================================================================
// Damage Effects
// ============================================================================

/**
 * Deal damage effect
 *
 * @example "Deal 3 damage to chosen character"
 * @example "Deal 2 damage to each opposing character"
 */
export interface DealDamageEffect {
  type: "deal-damage";
  amount?: AmountExpr;
  target?: CharacterTarget | LocationTarget;
  /** Which player chooses the target when the effect uses chosen targeting */
  chosenBy?: "you" | "opponent";
  selfReplacement?: NumericSelfReplacement;
}

/**
 * Put damage counters (different from "deal" - doesn't trigger "when dealt damage")
 */
export interface PutDamageEffect {
  type: "put-damage";
  amount: AmountExpr;
  target: CharacterTarget | LocationTarget;
}

/**
 * Remove damage effect
 *
 * @example "Remove up to 3 damage from chosen character"
 *
 * Wrap `amount` as `{ type: "up-to", value: N }` to allow the chooser to pick
 * any value in `[0, N]` (capped at the target's current damage). A bare amount
 * removes exactly N (still capped at the target's damage).
 */
export interface RemoveDamageEffect {
  type: "remove-damage";
  amount?: AmountExpr;
  target?: CharacterTarget | LocationTarget;
  selfReplacement?: NumericSelfReplacement;
  /** Ready each character that had damage removed */
  thenReady?: boolean;
}

/**
 * Move damage counters effect
 *
 * @example "Move 2 damage from chosen character to another"
 *
 * Wrap `amount` as `{ type: "up-to", value: N }` to allow the chooser to move
 * any value in `[0, N]`.
 */
export interface MoveDamageEffect {
  type: "move-damage";
  amount?: AmountExpr;
  distribution?: "aggregate" | "from-each-source";
  from?: CharacterTarget;
  to?: CharacterTarget;
  /**
   * Skip the resolver's immediate lethal-damage banish for the destination.
   * Use only when a printed effect must finish a follow-up instruction before
   * state-based lethal damage is checked.
   */
  deferLethalBanish?: boolean;
}

// ============================================================================
// Lore Effects
// ============================================================================

/**
 * Gain lore effect
 *
 * @example "Gain 2 lore"
 */
export interface GainLoreEffect {
  type: "gain-lore";
  amount?: AmountExpr;
  target?: PlayerTarget | LorcanaPlayerTarget;
  selfReplacement?: NumericSelfReplacement;
}

/**
 * Lose lore effect
 *
 * @example "Each opponent loses 1 lore"
 */
export interface LoseLoreEffect {
  type: "lose-lore";
  amount: AmountExpr;
  target?: PlayerTarget | LorcanaPlayerTarget;
}

// ============================================================================
// Card State Effects
// ============================================================================

/**
 * Exert effect
 *
 * @example "Exert chosen character"
 */
export interface ExertEffect {
  type: "exert";
  target?: CharacterTarget | ItemTarget | LocationTarget;
  /** Which player chooses the target when the effect uses chosen targeting */
  chosenBy?: "you" | "opponent";
}

/**
 * Ready effect
 *
 * @example "Ready chosen character"
 */
export interface ReadyEffect {
  type: "ready";
  target?: CharacterTarget | ItemTarget | LocationTarget;
  /** Restriction after readying */
  restriction?: "cant-quest" | "cant-challenge" | "cant-quest-or-challenge";
  /** Filter constraining which target is eligible (e.g. "Super" classification). */
  filter?: readonly CardFilter[];
}

/**
 * Banish effect
 *
 * @example "Banish chosen character"
 * @example "Banish all opposing items"
 */
export interface BanishEffect {
  type: "banish";
  target?: CharacterTarget | ItemTarget | LocationTarget;
  /** Which player chooses the target when the effect uses chosen targeting */
  chosenBy?: "you" | "opponent";
}

/**
 * Select a target and carry it forward for later effects in the same sequence.
 *
 * @example "Choose an opposing character. That character's player may..."
 */
export interface SelectTargetEffect {
  type: "select-target";
  target?: CharacterTarget | ItemTarget | LocationTarget | CardTarget | PlayerTarget;
}

// ============================================================================
// Look At / Reveal Effects
// ============================================================================

/**
 * Look at cards effect
 *
 * @example "Look at the top 3 cards of your deck"
 */
export interface LookAtCardsEffect {
  type: "look-at-cards";
  amount: AmountExpr;
  source: "deck" | "hand" | "discard";
  target: PlayerTarget;
}

/**
 * Put card into hand effect
 *
 * @example "Put a card into your hand"
 */
export interface PutInHandEffect {
  type: "put-in-hand";
  source: "deck" | "discard" | "revealed";
  target: PlayerTarget;
}
