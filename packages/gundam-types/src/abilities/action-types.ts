/**
 * Action Types for Gundam Effects
 *
 * Defines all atomic actions that can occur in Gundam.
 * Actions are the "what happens" part of effects.
 *
 * Organized into categories:
 * - Card Draw/Discard
 * - Damage
 * - Card State (rest)
 * - Stat Modification
 * - Keyword Granting
 *
 * @example "Draw 2 cards" = { type: "draw", amount: 2, target: "CONTROLLER" }
 * @example "Choose 1 rested enemy Unit with 3 or less HP" = { type: "choose", amount: 1, target: "ENEMY_UNIT", condition: "RESTED", filter: { type: "less-or-equal", value: 3 } }
 */

import type { UnitTarget } from "../targeting/gundam-target-dsl";

export type ActionDuration =
  | "this-turn"
  | "until-start-of-next-turn"
  | "until-end-of-turn"
  | "during-your-turn"
  | "while-condition"; // Used with static abilities

// ============================================================================
// Amount Types
// ============================================================================

/**
 * Amount can be a fixed number or variable based on game state
 */
export type Amount = number;

/**
 * Draw cards effect
 *
 * @example "Draw 2 cards"
 * @example "Each player draws a card"
 */
export interface DrawAction {
  type: "draw";
  amount: Amount;
  target: UnitTarget;
}

/**
 * Discard cards effect
 *
 * @example "Choose and discard a card"
 * @example "Each opponent discards a card at random"
 */
export interface DiscardAction {
  type: "discard";
  amount: Amount;
  target: UnitTarget;
  /** Whether the affected player chooses which cards */
  chosen?: boolean;
  /** If not chosen, discard is random */
  random?: boolean;
}

/**
 * Look at cards effect (for deck manipulation)
 */
export interface LookAtCardsAction {
  type: "look-at-cards";
  amount: Amount;
  from: "top-of-deck" | "hand" | "discard";
  target: UnitTarget;
  /** Follow-up actions */
  then?: LookAtFollowUp;
}

export type LookAtFollowUp =
  | { action: "put-in-hand"; count?: number }
  | { action: "put-on-top"; count?: number }
  | { action: "put-on-bottom"; count?: number }
  | { action: "put-in-resource-area"; count?: number };

// ============================================================================
// Card State Actions
// ============================================================================

/**
 * Rest action
 *
 * @example "Rest chosen unit"
 */
export interface RestAction {
  type: "rest";
  target: UnitTarget;
}

/**
 * Activate action
 *
 * @example "Activate chosen unit"
 */
export interface ActivateAction {
  type: "activate";
  target: UnitTarget;
}

// ============================================================================
// Damage Actions
// ============================================================================

/**
 * Deal damage action
 *
 * @example "Deal 3 damage to chosen character"
 * @example "Deal 2 damage to each opposing character"
 */
export interface DealDamageAction {
  type: "deal-damage";
  amount: Amount;
  target: UnitTarget;
}

/**
 * Remove damage action
 *
 * @example "Remove up to 3 damage from chosen character"
 */
export interface RemoveDamageAction {
  type: "remove-damage";
  amount: Amount;
  target: UnitTarget;
  /** "up to" allows removing less than max */
  upTo?: boolean;
}

// ============================================================================
// Zone Movement Actions
// ============================================================================

/**
 * Return to hand action
 *
 * @example "Return chosen character to their player's hand"
 */
export interface ReturnToHandAction {
  type: "return-to-hand";
  target: UnitTarget;
}

/**
 * Return from discard to hand action
 *
 * @example "Return an action card from your discard to your hand"
 */
export interface ReturnFromDiscardAction {
  type: "return-from-discard";
  cardName?: string;
  target: UnitTarget;
}

/**
 * Put into resource area action
 *
 * @example "Put the top card of your deck into your resource area and rested"
 */
export interface PutIntoResourceAreaAction {
  type: "put-into-resource-area";
  source: "this-card" | "resourceDeck";
  target?: UnitTarget;
  rested?: boolean;
}

// ============================================================================
// Deploy unit or base Actions
// ============================================================================

/**
 * Deploy a unit or base action
 *
 * @example "Play a character with cost 3 or less for free"
 * @example "Play a character from your discard for free"
 */
export interface DeployUnitOrBaseAction {
  type: "deploy-unit-or-base";
  from: "hand" | "discard" | "deck" | "under-self";
  target: UnitTarget;
}

// ============================================================================
// Stat Modification Actions
// ============================================================================

/**
 * Modify stat action (for "this turn" effects)
 *
 * @example "Chosen character gets +2 AP this turn"
 * @example "Your characters get +1 HP this turn"
 */
export interface ModifyStatAction {
  type: "modify-stat";
  stat: "ap" | "hp";
  modifier: Amount;
  target: UnitTarget;
}

// ============================================================================
// Keyword Actions
// ============================================================================

/**
 * Grant keyword effect
 *
 * @example "Chosen character gains keyword this turn"
 * @example "Your characters gain keyword +2 this turn"
 */
export interface GainKeywordAction {
  type: "gain-keyword";
  keyword: string;
  /** For Challenger +X and Resist +X */
  value?: number;
  target: UnitTarget;
  duration?: ActionDuration;
}

/**
 * Lose keyword effect
 */
export interface LoseKeywordAction {
  type: "lose-keyword";
  keyword: string;
  target: UnitTarget;
  duration?: ActionDuration;
}

// ============================================================================
// Restriction Actions
// ============================================================================

/**
 * Apply restriction action
 *
 * @example "Chosen character can't quest during their next turn"
 * @example "Characters can't be challenged while here"
 */
export interface RestrictionAction {
  type: "restriction";
  restriction:
    | "cant-activate"
    | "cant-be-attacked"
    | "cant-receive-damage"
    | "enters-battle-rested";
  target: UnitTarget;
  duration?: ActionDuration;
}

// ============================================================================
// Combined Action Type
// ============================================================================

/**
 * All possible actions
 */
export type Action =
  // Draw/Discard
  | DrawAction
  | DiscardAction
  // Look at cards
  | LookAtCardsAction
  // Zone movement
  | ReturnToHandAction
  | ReturnFromDiscardAction
  | PutIntoResourceAreaAction
  // Deploy unit or base
  | DeployUnitOrBaseAction
  // Stat modification
  | ModifyStatAction
  // Keyword
  | GainKeywordAction
  | LoseKeywordAction
  // Restriction
  | RestrictionAction;
