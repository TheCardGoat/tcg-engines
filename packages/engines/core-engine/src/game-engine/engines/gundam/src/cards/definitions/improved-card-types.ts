/**
 * Improved Gundam Card Type Definitions
 *
 * This file provides enhanced type definitions for Gundam cards with:
 * - Better separation of concerns between card structure and game effects
 * - More precise typing for abilities and their activation conditions
 * - Clear API for card interactions and state management
 * - Proper modeling of keyword effects as defined in the rules
 */

import type {
  BoardZones,
  CardColor,
  CardRarity,
  CardZones,
  GundamitoCardSet,
  GundamitoCardType,
  Traits,
} from "../../../shared-types";

// ============================================================================
// CORE ABILITY SYSTEM
// ============================================================================

/**
 * Timing keywords that define when abilities can be activated
 * Based on rules sections 11-2 (Keywords)
 */
export type AbilityTiming =
  | "main" // 【Main】- During main phase
  | "action" // 【Action】- During action steps
  | "deploy" // 【Deploy】- When card enters battle area
  | "attack" // 【Attack】- When unit declares attack
  | "destroyed" // 【Destroyed】- When unit/base is destroyed
  | "when-paired" // 【When Paired】- When pilot is paired
  | "during-pair" // 【During Pair】- While pilot is paired
  | "burst" // 【Burst】- When shield is destroyed
  | "activate-main" // 【Activate･Main】- Activated during main phase
  | "activate-action" // 【Activate･Action】- Activated during action steps
  | "constant"; // Always active (no timing restriction)

/**
 * Keyword effects with their specific mechanics
 * Based on rules section 11-1 (Keyword Effects)
 */
export interface KeywordEffect {
  readonly keyword:
    | "repair"
    | "breach"
    | "support"
    | "blocker"
    | "first-strike"
    | "high-maneuver";
  readonly value?: number; // For effects like <Repair 2>, <Breach 1>
}

/**
 * Activation costs for abilities
 */
export interface ActivationCost {
  readonly type: "resource" | "rest-self" | "discard" | "custom";
  readonly amount?: number;
  readonly description?: string;
}

/**
 * Target specification for abilities
 */
export interface AbilityTarget {
  readonly type:
    | "self"
    | "paired-unit"
    | "enemy-unit"
    | "friendly-unit"
    | "player"
    | "shield"
    | "custom";
  readonly amount?: number | "all";
  readonly filters?: TargetFilter[];
  readonly optional?: boolean;
}

export interface TargetFilter {
  readonly property:
    | "hp"
    | "ap"
    | "cost"
    | "level"
    | "trait"
    | "zone"
    | "state";
  readonly operator:
    | "equals"
    | "greater"
    | "less"
    | "greater-equal"
    | "less-equal"
    | "contains";
  readonly value: string | number | boolean;
}

/**
 * Base ability interface
 */
export interface BaseAbility {
  readonly id?: string;
  readonly timing: AbilityTiming;
  readonly name?: string;
  readonly text: string; // Human-readable description
  readonly cost?: ActivationCost[];
  readonly targets?: AbilityTarget[];
  readonly restrictions?: AbilityRestriction[];
  readonly effects: GameEffect[];
}

/**
 * Restrictions on ability activation
 */
export interface AbilityRestriction {
  readonly type: "once-per-turn" | "linked-only" | "combat-only" | "custom";
  readonly description?: string;
}

// ============================================================================
// GAME EFFECTS SYSTEM
// ============================================================================

/**
 * Base interface for all game effects
 */
export interface BaseGameEffect {
  readonly type: string;
  readonly description?: string;
}

/**
 * Card manipulation effects
 */
export interface DrawCardsEffect extends BaseGameEffect {
  readonly type: "draw-cards";
  readonly amount: number;
}

export interface DiscardCardsEffect extends BaseGameEffect {
  readonly type: "discard-cards";
  readonly amount: number;
  readonly target: AbilityTarget;
}

export interface SearchDeckEffect extends BaseGameEffect {
  readonly type: "search-deck";
  readonly filters: TargetFilter[];
  readonly amount: number;
  readonly reveal?: boolean;
}

/**
 * Unit state effects
 */
export interface RestUnitEffect extends BaseGameEffect {
  readonly type: "rest-unit";
  readonly target: AbilityTarget;
}

export interface ActivateUnitEffect extends BaseGameEffect {
  readonly type: "activate-unit";
  readonly target: AbilityTarget;
}

export interface HealDamageEffect extends BaseGameEffect {
  readonly type: "heal-damage";
  readonly amount: number;
  readonly target: AbilityTarget;
}

export interface DealDamageEffect extends BaseGameEffect {
  readonly type: "deal-damage";
  readonly amount: number;
  readonly target: AbilityTarget;
  readonly damageType?: "battle" | "effect";
}

/**
 * Stat modification effects
 */
export interface ModifyStatsEffect extends BaseGameEffect {
  readonly type: "modify-stats";
  readonly stat: "ap" | "hp";
  readonly modifier: number;
  readonly duration: "turn" | "battle" | "permanent";
  readonly target: AbilityTarget;
}

/**
 * Zone manipulation effects
 */
export interface MoveCardEffect extends BaseGameEffect {
  readonly type: "move-card";
  readonly from: BoardZones;
  readonly to: BoardZones;
  readonly target: AbilityTarget;
  readonly facedown?: boolean;
}

export interface DeployUnitEffect extends BaseGameEffect {
  readonly type: "deploy-unit";
  readonly costReduction?: number;
  readonly conditions?: TargetFilter[];
}

/**
 * Conditional effects
 */
export interface ConditionalEffect extends BaseGameEffect {
  readonly type: "conditional";
  readonly condition: TargetFilter[];
  readonly ifTrue: GameEffect[];
  readonly ifFalse?: GameEffect[];
}

/**
 * Union type for all game effects
 */
export type GameEffect =
  | DrawCardsEffect
  | DiscardCardsEffect
  | SearchDeckEffect
  | RestUnitEffect
  | ActivateUnitEffect
  | HealDamageEffect
  | DealDamageEffect
  | ModifyStatsEffect
  | MoveCardEffect
  | DeployUnitEffect
  | ConditionalEffect;

// ============================================================================
// SPECIFIC ABILITY TYPES
// ============================================================================

/**
 * Keyword abilities (passive effects)
 */
export interface KeywordAbility extends BaseAbility {
  readonly timing: "constant";
  readonly keyword: KeywordEffect;
  readonly effects: []; // Keyword effects are handled by game engine
}

/**
 * Triggered abilities (automatic activation)
 */
export interface TriggeredAbility extends BaseAbility {
  readonly timing: "deploy" | "attack" | "destroyed" | "when-paired" | "burst";
  readonly triggerCondition?: TargetFilter[];
}

/**
 * Activated abilities (manual activation)
 */
export interface ActivatedAbility extends BaseAbility {
  readonly timing: "activate-main" | "activate-action";
  readonly cost: ActivationCost[];
}

/**
 * Continuous abilities (ongoing effects)
 */
export interface ContinuousAbility extends BaseAbility {
  readonly timing: "during-pair" | "constant";
  readonly duration?: "while-paired" | "while-in-play" | "turn" | "battle";
}

/**
 * Command abilities (one-time use)
 */
export interface CommandAbility extends BaseAbility {
  readonly timing: "main" | "action";
}

/**
 * Union type for all abilities
 */
export type CardAbility =
  | KeywordAbility
  | TriggeredAbility
  | ActivatedAbility
  | ContinuousAbility
  | CommandAbility;

// ============================================================================
// IMPROVED CARD TYPE DEFINITIONS
// ============================================================================

/**
 * Base interface for all Gundam cards
 */
interface GundamCardBase {
  readonly id: string;
  readonly implemented?: boolean;
  readonly missingTestCase?: boolean;
  readonly name: string;
  readonly cost: number;
  readonly level: number;
  readonly number: number;
  readonly color: CardColor;
  readonly set: GundamitoCardSet;
  readonly rarity: CardRarity;
  readonly flavorText?: string;
  readonly sourceTitle?: string;
}

/**
 * Enhanced Unit card definition
 */
export interface GundamUnitCard extends GundamCardBase {
  readonly type: "unit";
  readonly zones: readonly CardZones[];
  readonly traits: readonly Traits[];
  readonly linkRequirement: readonly string[];
  readonly ap: number;
  readonly hp: number;
  readonly abilities: readonly CardAbility[];
  readonly keywords: readonly KeywordEffect[];
}

/**
 * Enhanced Pilot card definition
 */
export interface GundamPilotCard extends GundamCardBase {
  readonly type: "pilot";
  readonly traits: readonly Traits[];
  readonly apModifier: number;
  readonly hpModifier: number;
  readonly abilities: readonly CardAbility[];
  readonly pilotName?: string; // For command cards with pilot effects
}

/**
 * Enhanced Command card definition
 */
export interface GundamCommandCard extends GundamCardBase {
  readonly type: "command";
  readonly abilities: readonly CommandAbility[];
  readonly pilotEffect?: GundamPilotCard; // For command cards that can be pilots
}

/**
 * Enhanced Base card definition
 */
export interface GundamBaseCard extends GundamCardBase {
  readonly type: "base";
  readonly zones: readonly CardZones[];
  readonly traits: readonly Traits[];
  readonly ap: number;
  readonly hp: number;
  readonly abilities: readonly CardAbility[];
}

/**
 * Resource card definition (no changes needed - already simple)
 */
export interface GundamResourceCard
  extends Omit<GundamCardBase, "cost" | "level" | "color"> {
  readonly type: "resource";
}

/**
 * Union type for all Gundam cards
 */
export type GundamCard =
  | GundamUnitCard
  | GundamPilotCard
  | GundamCommandCard
  | GundamBaseCard
  | GundamResourceCard;

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

export const isUnitCard = (card: GundamCard): card is GundamUnitCard =>
  card.type === "unit";

export const isPilotCard = (card: GundamCard): card is GundamPilotCard =>
  card.type === "pilot";

export const isCommandCard = (card: GundamCard): card is GundamCommandCard =>
  card.type === "command";

export const isBaseCard = (card: GundamCard): card is GundamBaseCard =>
  card.type === "base";

export const isResourceCard = (card: GundamCard): card is GundamResourceCard =>
  card.type === "resource";

/**
 * Utility to check if a card has a specific keyword
 */
export const hasKeyword = (
  card: GundamCard,
  keyword: KeywordEffect["keyword"],
): boolean => {
  if (!("keywords" in card)) return false;
  return card.keywords.some((k) => k.keyword === keyword);
};

/**
 * Utility to get keyword effect value
 */
export const getKeywordValue = (
  card: GundamCard,
  keyword: KeywordEffect["keyword"],
): number | undefined => {
  if (!("keywords" in card)) return undefined;
  return card.keywords.find((k) => k.keyword === keyword)?.value;
};

/**
 * Utility to filter abilities by timing
 */
export const getAbilitiesByTiming = (
  abilities: readonly CardAbility[],
  timing: AbilityTiming,
): CardAbility[] => {
  return abilities.filter((ability) => ability.timing === timing);
};
