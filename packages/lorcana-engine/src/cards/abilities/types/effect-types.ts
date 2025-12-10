/**
 * Effect Types for Lorcana Abilities
 *
 * Defines all atomic effects that can occur in Lorcana.
 * Effects are the "what happens" part of abilities.
 *
 * Organized into categories:
 * - Card Draw/Discard
 * - Damage
 * - Lore
 * - Card State (exert/ready)
 * - Movement (zones, locations)
 * - Stat Modification
 * - Keyword Granting
 * - Control Flow (sequence, choice, conditional, for-each)
 *
 * @example "Draw 2 cards" = { type: "draw", amount: 2, target: "CONTROLLER" }
 * @example "Deal 3 damage to chosen character" = { type: "deal-damage", amount: 3, target: "CHOSEN_CHARACTER" }
 */

import type { CardType } from "../../../types/card-types";
import type { Condition } from "./condition-types";
import type {
  CardTarget,
  CharacterTarget,
  ItemTarget,
  LocationTarget,
  PlayerTarget,
  TargetZone,
} from "./target-types";

// ============================================================================
// Amount Types
// ============================================================================

/**
 * Amount can be a fixed number or variable based on game state
 */
export type Amount = number | VariableAmount;

/**
 * Variable amount calculated from game state
 */
export type VariableAmount =
  | { type: "damage-on-target" }
  | { type: "damage-on-self" }
  | { type: "cards-in-hand"; controller: "you" | "opponent" }
  | { type: "characters-in-play"; controller: "you" | "opponent" }
  | { type: "items-in-play"; controller: "you" | "opponent" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" }
  | { type: "lore"; controller: "you" | "opponent" }
  | { type: "strength-of"; target: CharacterTarget }
  | { type: "willpower-of"; target: CharacterTarget }
  | { type: "lore-value-of"; target: CharacterTarget }
  | { type: "cost-of"; target: CardTarget }
  | { type: "cards-under-self" }
  | {
      type: "classification-character-count";
      classification: string;
      controller: "you" | "opponent";
    }
  | { type: "locations-in-play"; controller: "you" | "opponent" };

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
  amount: Amount;
  target: PlayerTarget;
}

/**
 * Discard cards effect
 *
 * @example "Choose and discard a card"
 * @example "Each opponent discards a card at random"
 */
export interface DiscardEffect {
  type: "discard";
  amount: Amount;
  target: PlayerTarget;
  /** Whether the affected player chooses which cards */
  chosen?: boolean;
  /** If not chosen, discard is random */
  random?: boolean;
  /** Discard from specific zone (default: hand) */
  from?: TargetZone;
}

/**
 * Look at cards effect (for deck manipulation)
 */
export interface LookAtCardsEffect {
  type: "look-at-cards";
  amount: Amount;
  from: "top-of-deck" | "hand" | "discard";
  target: PlayerTarget;
  /** Follow-up actions */
  then?: LookAtFollowUp;
}

export type LookAtFollowUp =
  | { action: "put-in-hand"; count?: number; filter?: CardTypeFilter }
  | { action: "put-on-top"; count?: number }
  | { action: "put-on-bottom"; count?: number }
  | { action: "put-in-inkwell"; count?: number }
  | {
      action: "reveal-and-play";
      filter?: CardTypeFilter;
      cost?: "free" | "reduced";
    };

export type CardTypeFilter =
  | { type: "card-type"; cardType: CardType | "song" | "floodborn" }
  | { type: "classification"; classification: string }
  | { type: "name"; name: string }
  | {
      type: "cost-comparison";
      comparison: "less-or-equal" | "equal";
      value: number;
    };

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
  amount: Amount;
  target: CharacterTarget | LocationTarget;
}

/**
 * Put damage counters (different from "deal" - doesn't trigger "when dealt damage")
 */
export interface PutDamageEffect {
  type: "put-damage";
  amount: Amount;
  target: CharacterTarget | LocationTarget;
}

/**
 * Remove damage effect
 *
 * @example "Remove up to 3 damage from chosen character"
 */
export interface RemoveDamageEffect {
  type: "remove-damage";
  amount: Amount;
  target: CharacterTarget | LocationTarget;
  /** "up to" allows removing less than max */
  upTo?: boolean;
}

/**
 * Move damage counters effect
 *
 * @example "Move 2 damage from chosen character to another"
 */
export interface MoveDamageEffect {
  type: "move-damage";
  amount: Amount;
  from: CharacterTarget;
  to: CharacterTarget;
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
  amount: Amount;
  target?: PlayerTarget;
}

/**
 * Lose lore effect
 *
 * @example "Each opponent loses 1 lore"
 */
export interface LoseLoreEffect {
  type: "lose-lore";
  amount: Amount;
  target: PlayerTarget;
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
  target: CharacterTarget | ItemTarget | LocationTarget;
}

/**
 * Ready effect
 *
 * @example "Ready chosen character"
 */
export interface ReadyEffect {
  type: "ready";
  target: CharacterTarget | ItemTarget | LocationTarget;
  /** Restriction after readying */
  restriction?: "cant-quest" | "cant-challenge" | "cant-quest-or-challenge";
}

/**
 * Banish effect
 *
 * @example "Banish chosen character"
 * @example "Banish all opposing items"
 */
export interface BanishEffect {
  type: "banish";
  target: CharacterTarget | ItemTarget | LocationTarget;
}

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
    | "revealed";
  target?: PlayerTarget;
  cardType?: CardType;
  exerted?: boolean;
}

/**
 * Put card under another card (Boost mechanic)
 */
export interface PutUnderEffect {
  type: "put-under";
  source: "top-of-deck" | "hand";
  under: CharacterTarget | LocationTarget | "self";
  cardType?: CardType;
}

/**
 * Shuffle into deck effect
 */
export interface ShuffleIntoDeckEffect {
  type: "shuffle-into-deck";
  target: CharacterTarget | ItemTarget | LocationTarget;
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

// ============================================================================
// Stat Modification Effects
// ============================================================================

/**
 * Modify stat effect (for "this turn" effects)
 *
 * @example "Chosen character gets +2 strength this turn"
 * @example "Your characters get +1 lore this turn"
 */
export interface ModifyStatEffect {
  type: "modify-stat";
  stat: "strength" | "willpower" | "lore";
  modifier: Amount;
  target: CharacterTarget | LocationTarget;
  duration?: EffectDuration;
}

/**
 * Set stat effect (absolute value)
 */
export interface SetStatEffect {
  type: "set-stat";
  stat: "strength" | "willpower" | "lore";
  value: Amount;
  target: CharacterTarget;
  duration?: EffectDuration;
}

export type EffectDuration =
  | "this-turn"
  | "until-start-of-next-turn"
  | "until-end-of-turn"
  | "permanent"
  | "while-condition"; // Used with static abilities

// ============================================================================
// Keyword Effects
// ============================================================================

/**
 * Grant keyword effect
 *
 * @example "Chosen character gains Rush this turn"
 * @example "Your characters gain Resist +2 this turn"
 */
export interface GainKeywordEffect {
  type: "gain-keyword";
  keyword:
    | "Rush"
    | "Ward"
    | "Evasive"
    | "Bodyguard"
    | "Support"
    | "Reckless"
    | "Alert"
    | "Challenger"
    | "Resist";
  /** For Challenger +X and Resist +X */
  value?: number;
  target: CharacterTarget;
  duration?: EffectDuration;
}

/**
 * Lose keyword effect
 */
export interface LoseKeywordEffect {
  type: "lose-keyword";
  keyword: string;
  target: CharacterTarget;
  duration?: EffectDuration;
}

// ============================================================================
// Restriction Effects
// ============================================================================

/**
 * Apply restriction effect
 *
 * @example "Chosen character can't quest during their next turn"
 * @example "Characters can't be challenged while here"
 */
export interface RestrictionEffect {
  type: "restriction";
  restriction:
    | "cant-quest"
    | "cant-challenge"
    | "cant-be-challenged"
    | "cant-ready"
    | "cant-quest-or-challenge"
    | "cant-be-dealt-damage"
    | "cant-sing"
    | "cant-move"
    | "enters-play-exerted"
    | "skip-draw-step";
  target: CharacterTarget | PlayerTarget;
  duration?: EffectDuration;
}

/**
 * Grant ability effect (can challenge ready characters, etc.)
 */
export interface GrantAbilityEffect {
  type: "grant-ability";
  ability:
    | "can-challenge-ready"
    | "takes-no-damage-from-challenges"
    | "return-to-hand-when-banished";
  target: CharacterTarget;
  duration?: EffectDuration;
}

/**
 * Reduce cost effect
 *
 * @example "You pay 1 less to play this item"
 */
export interface CostReductionEffect {
  type: "cost-reduction";
  amount: number;
  cardType?: CardType | "song";
  target?: PlayerTarget; // Who gets the reduction (usually YOU)
  duration?: EffectDuration;
}

export interface NameACardEffect {
  type: "name-a-card";
}

export interface RevealTopCardEffect {
  type: "reveal-top-card";
  target?: PlayerTarget; // Whose deck
}

export interface PutOnTopEffect {
  type: "put-on-top";
  source: "revealed" | CardTarget;
}

export interface DrawUntilHandSizeEffect {
  type: "draw-until-hand-size";
  size: number;
  target?: PlayerTarget;
}

// ============================================================================

// ============================================================================
// Control Flow Effects
// ============================================================================

/**
 * Sequence of effects (executed in order)
 *
 * @example "Draw 2 cards, then choose and discard a card"
 */
export interface SequenceEffect {
  type: "sequence";
  steps: Effect[];
}

/**
 * Choose one of multiple effects
 *
 * @example "Choose one: Draw a card. Deal 2 damage to chosen character."
 */
export interface ChoiceEffect {
  type: "choice";
  options: Effect[];
  /** Who makes the choice */
  chooser?: PlayerTarget;
  /** Label/name for each option (for display) */
  optionLabels?: string[];
}

/**
 * Conditional effect (if/then/else)
 *
 * @example "If you have a character named Elsa, draw a card"
 */
export interface ConditionalEffect {
  type: "conditional";
  condition: Condition;
  then: Effect;
  else?: Effect;
}

/**
 * Optional effect ("you may")
 *
 * @example "You may draw a card"
 */
export interface OptionalEffect {
  type: "optional";
  effect: Effect;
  /** Who decides */
  chooser?: PlayerTarget;
}

/**
 * For-each effect (repeat for each X)
 *
 * @example "Gain 1 lore for each character you have in play"
 */
export interface ForEachEffect {
  type: "for-each";
  counter: ForEachCounter;
  effect: Effect;
  /** Maximum times to repeat (optional) */
  maximum?: number;
}

export type ForEachCounter =
  | { type: "characters"; controller: "you" | "opponent" | "any" }
  | { type: "damaged-characters"; controller: "you" | "opponent" | "any" }
  | { type: "items"; controller: "you" | "opponent" }
  | { type: "locations"; controller: "you" | "opponent" }
  | { type: "cards-in-hand"; controller: "you" | "opponent" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" }
  | { type: "damage-on-self" }
  | { type: "damage-on-target" }
  | { type: "cards-under-self" }
  | { type: "characters-that-sang"; thisTurn: boolean };

/**
 * Repeat effect X times
 */
export interface RepeatEffect {
  type: "repeat";
  times: Amount;
  effect: Effect;
}

// ============================================================================
// Special State Modifications
// ============================================================================

/**
 * Enters play modification effect
 *
 * @example "Enters play exerted"
 * @example "Enters play with 2 damage"
 */
export interface EntersPlayEffect {
  type: "enters-play-modification";
  modification: "exerted" | "damaged";
  amount?: number; // for damaged
  target: CharacterTarget;
}

/**
 * Win condition modification effect
 *
 * @example "Opponents need 25 lore to win"
 */
export interface WinConditionEffect {
  type: "win-condition-modification";
  loreRequired: number;
  target: PlayerTarget;
}

/**
 * Property modification effect
 *
 * @example "This character counts as being named 'Dalmatian Puppy'"
 */
export interface PropertyModificationEffect {
  type: "property-modification";
  property: "name";
  value: string;
  operation: "add-alias";
  target: CharacterTarget;
}

// ============================================================================
// Reveal/Search Effects
// ============================================================================

/**
 * Reveal hand effect
 */
export interface RevealHandEffect {
  type: "reveal-hand";
  target: PlayerTarget;
}

/**
 * Search deck effect
 */
export interface SearchDeckEffect {
  type: "search-deck";
  cardType?: CardType | "song" | "floodborn";
  cardName?: string;
  classification?: string;
  putInto: "hand" | "top-of-deck" | "play";
  reveal?: boolean;
  shuffle?: boolean;
}

// ============================================================================
// Combined Effect Type
// ============================================================================

/**
 * All possible effects
 */
export type Effect =
  // Draw/Discard
  | DrawEffect
  | DiscardEffect
  | LookAtCardsEffect
  // Damage
  | DealDamageEffect
  | PutDamageEffect
  | RemoveDamageEffect
  | MoveDamageEffect
  // Lore
  | GainLoreEffect
  | LoseLoreEffect
  // Card State
  | ExertEffect
  | ReadyEffect
  | BanishEffect
  // Zone Movement
  | ReturnToHandEffect
  | ReturnFromDiscardEffect
  | PutIntoInkwellEffect
  | PutUnderEffect
  | ShuffleIntoDeckEffect
  | PutOnBottomEffect
  // Play Card
  | PlayCardEffect
  // Location Movement
  | MoveToLocationEffect
  // Stat Modification
  | ModifyStatEffect
  | SetStatEffect
  // Keywords
  | GainKeywordEffect
  | LoseKeywordEffect
  // Restrictions
  | RestrictionEffect
  | GrantAbilityEffect
  | CostReductionEffect
  | NameACardEffect
  | RevealTopCardEffect
  | PutOnTopEffect
  | DrawUntilHandSizeEffect
  // Control Flow
  | SequenceEffect
  | ChoiceEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect
  // Reveal/Search
  | RevealHandEffect
  | SearchDeckEffect
  // Special State Modifications
  | EntersPlayEffect
  | WinConditionEffect
  | PropertyModificationEffect;

/**
 * Static effects (always active, used in static abilities)
 * These don't "happen" - they modify the game state
 */
export type StaticEffect =
  | ModifyStatEffect
  | GainKeywordEffect
  | RestrictionEffect
  | GrantAbilityEffect
  | EntersPlayEffect
  | WinConditionEffect
  | PropertyModificationEffect
  | CostReductionEffect;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if effect is a control flow effect
 */
export function isControlFlowEffect(
  effect: Effect,
): effect is
  | SequenceEffect
  | ChoiceEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect {
  return (
    effect.type === "sequence" ||
    effect.type === "choice" ||
    effect.type === "conditional" ||
    effect.type === "optional" ||
    effect.type === "for-each" ||
    effect.type === "repeat"
  );
}

/**
 * Check if effect targets characters
 */
export function targetsCharacters(effect: Effect): boolean {
  return (
    "target" in effect &&
    typeof effect.target === "string" &&
    (effect.target.includes("CHARACTER") ||
      effect.target === "SELF" ||
      effect.target === "THIS_CHARACTER")
  );
}

/**
 * Check if amount is variable (vs fixed number)
 */
export function isVariableAmount(amount: Amount): amount is VariableAmount {
  return typeof amount === "object";
}
