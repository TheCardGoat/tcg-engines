/**
 * Modifier Effect Types
 *
 * Effects that modify game state or card properties:
 * - Stat modifications (strength, willpower, lore)
 * - Keyword granting/removal
 * - Restrictions
 * - Special state modifications
 * - Reveal/Search effects
 */

import type { CardType } from "../../cards/card-types";
import type {
  CardTarget,
  CharacterTarget,
  LocationTarget,
  PlayerTarget,
} from "../target-types";
import type { Amount, EffectDuration } from "./amount-types";

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
  amount: Amount;
  cardType?: CardType | "song";
  target?: PlayerTarget; // Who gets the reduction (usually YOU)
  duration?: EffectDuration;
}

// ============================================================================
// Misc Effects
// ============================================================================

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
