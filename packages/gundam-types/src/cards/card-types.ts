/**
 * Card Type Definitions for Gundam Card Game
 *
 * These types define the structure of card definitions in the @tcg/gundam engine.
 * All cards are plain data objects following @tcg/core patterns.
 */

// ============================================================================
// EFFECT TYPES
// ============================================================================

/**
 * Effect restrictions that limit how often an effect can be used
 */
export type EffectRestriction = "ONCE_PER_TURN";
export type EffectConditions = "DURING_PAIR" | "DURING_LINK";

/**
 * Types of actions/effects that can be performed
 */
export type EffectActionType =
  | "DRAW" // Draw cards from deck
  | "DAMAGE" // Deal damage to units/players
  | "HEAL" // Restore HP
  | "REST" // Change unit to rest state
  | "STAND" // Change unit to stand state
  | "DESTROY" // Destroy a unit
  | "SEARCH" // Search deck for cards
  | "ADD_TO_HAND" // Add card from deck to hand
  | "DISCARD" // Discard cards from hand
  | "MODIFY_STATS" // Modify AP/HP
  | "GAIN_KEYWORDS" // Add keyword abilities
  | "REMOVE_KEYWORDS" // Remove keyword abilities
  | "SWITCH_CONTROL" // Change control of units
  | "PREVENT_DAMAGE" // Prevent damage that would be dealt
  | "CUSTOM"; // Custom effect text

/**
 * Target selection for effects
 */
export interface EffectTarget {
  /** Who/what can be targeted */
  player: "SELF" | "OPPONENT" | "BOTH" | "ANY";

  /** What card types can be targeted */
  cardTypes?: ("UNIT" | "PILOT" | "COMMAND" | "BASE")[];

  /** Target must be in specific location */
  location?: ("field" | "hand" | "deck" | "discard" | "shield")[];

  /** Target must have specific traits */
  traits?: string[];

  /** Target must meet specific condition (e.g., "HP <= 3", "AP >= 5") */
  condition?: string;

  /** How many targets to choose */
  count?: number;

  /** Whether player can choose fewer targets ("up to X") */
  upTo?: boolean;

  /** Whether player must choose targets if available */
  mustChoose?: boolean;
}

/**
 * The actual action/compensation part of an effect
 */
export interface EffectAction {
  /** Type of action to perform */
  type: EffectActionType;

  /** Target selection for this action */
  target?: EffectTarget;

  /** Numeric value for the action (e.g., damage amount, cards to draw) */
  value?: number;

  /** Text for custom actions or additional details */
  text?: string;

  /** Parameters specific to the action type */
  parameters?: Record<string, unknown>;
}

/**
 * Base effect structure according to rules 5-1 and 10-1
 * An effect consists of a directive and related compensation which originate
 * from the text on a card.
 */
export interface BaseEffect {
  /** Unique identifier for this effect */
  id: string;

  /** Human-readable description (original card text) */
  description: string;

  /** Whether this effect is mandatory ("instructed to perform") or optional ("you may") */
  optional?: boolean;

  /** Target location where effect can be activated (default: field only) */
  targetLocation?: "field" | "hand" | "deck" | "discard" | "any";

  /** Effect restrictions that limit usage */
  restrictions?: EffectRestriction[];

  /** What the effect actually does (the compensation part) */
  action: EffectAction;
}

/**
 * 10-1-5. Constant Effects
 * A constant effect is an effect that remains constantly active in some form.
 */
export interface ConstantEffect extends BaseEffect {
  type: "CONSTANT";

  /** Conditions that must be fulfilled for effect to remain active */
  conditions?: EffectConditions[];

  /** Whether effect has conditional targets applied when conditions appear */
  hasConditionalTargets?: boolean;

  /** Whether this effect takes precedence over conflicting effects */
  precedence?: boolean;
}

/**
 * 10-1-6. Triggered Effects
 * A triggered effect activates automatically when some conditional event occurs.
 */
export interface TriggeredEffect extends BaseEffect {
  type: "TRIGGERED";

  /** When the effect triggers - effects that specify timing */
  timing:
    | "DEPLOY" // 【Deploy】
    | "ATTACK" // 【Attack】
    | "DESTROYED" // 【Destroyed】
    | "WHEN_PAIRED" // 【When Paired】
    | "WHEN_LINKED" // Custom trigger
    | "BURST"; // 【Burst】 - takes priority over other triggered effects

  /** Custom trigger condition like "when (some event occurs)" */
  customTrigger?: string;

  /** Whether effect still activates if card leaves location after triggering */
  persistsAfterLeaving?: boolean;
}

/**
 * 10-1-7. Activated Effects
 * An activated effect can be freely activated by the player.
 */
export interface ActivatedEffect extends BaseEffect {
  type: "ACTIVATED";

  /** When the effect can be activated */
  timing: "MAIN" | "ACTION"; // 【Activate･Main】, 【Activate･Action】

  /** Cost to activate (①, ②, etc.) */
  cost?: number;

  /** Additional activation conditions */
  additionalConditions?: string[];

  /** Whether effect requires declaration to activate (no colon/conditions) */
  requiresDeclaration?: boolean;
}

/**
 * 10-1-8. Command Effects
 * A command effect activates when it is played during the timing specified on a Command card.
 */
export interface CommandEffect extends BaseEffect {
  type: "COMMAND";

  /** When the command can be played */
  timing: "MAIN" | "ACTION" | "BURST";

  /** Whether this effect requires choosing targets to play */
  requiresTarget?: boolean;

  /** Target requirements for playing the card */
  targetRequirements?: string[];
}

/**
 * 10-1-9. Substitution Effects
 * When some event would occur, a substitution effect replaces the implementation
 * of that event with another event.
 */
export interface SubstitutionEffect extends BaseEffect {
  type: "SUBSTITUTION";

  /** The original event that would occur (A in "do B instead of A") */
  originalEvent: string;

  /** The replacement event that occurs instead (B in "do B instead of A") */
  replacementEvent: string;
}

/**
 * Union type for all effect types according to rules 10-1-4
 */
export type Effect =
  | ConstantEffect
  | TriggeredEffect
  | ActivatedEffect
  | CommandEffect
  | SubstitutionEffect;

// ============================================================================
// ABILITY TYPES
// ============================================================================

export type KeywordAbility = {
  keyword:
    | "Repair"
    | "Breach"
    | "Support"
    | "Blocker"
    | "First-Strike"
    | "High-Maneuver"
    | "Suppression";
  value?: number;
};

// Condition types (prerequisites for triggers)
export type ConditionType = "DURING_LINK" | "DURING_PAIR";

// Trigger types (actual events that can fire)
export type TriggerType =
  | "ON_DEPLOY"
  | "ON_ATTACK"
  | "ON_DESTROYED"
  | "WHEN_PAIRED"
  | "WHEN_LINKED"
  | "ON_BURST";

export type ParsedAbility = {
  // Timing/trigger information
  optional?: boolean;

  // Conditional trigger support
  condition?: ConditionType;
  trigger?: TriggerType;

  // Activated ability information
  activated?: {
    timing: "MAIN" | "ACTION";
    cost?: string;
  };

  // Human-readable description (original card text)
  description: string;

  // Structured effect data
  effect: {
    type: string; // "DRAW", "DAMAGE", "SEARCH", "MODIFY_STATS", etc.
    [key: string]: unknown; // Effect-specific parameters
  };
};

// ============================================================================
// BASE CARD DEFINITION
// ============================================================================

export type BaseCardDefinition = {
  /** Unique identifier (e.g., "st01-001") */
  id: string;

  /** Card name */
  name: string;

  /** Card number (e.g., "ST01-001") */
  cardNumber: string;

  /** Set code (e.g., "ST01") */
  setCode: string;

  /** Card type */
  cardType: "UNIT" | "PILOT" | "COMMAND" | "BASE" | "RESOURCE";

  /** Rarity */
  rarity: "common" | "uncommon" | "rare" | "super-rare" | "legendary";

  /** Color (not present on resource cards) */
  color?: "blue" | "red" | "green" | "white";

  /** Level requirement */
  level?: number;

  /** Cost to play */
  cost?: number;

  /** Original card text */
  text?: string;

  /** Card image URL */
  imageUrl?: string;

  /** Source title (e.g., "Mobile Suit Gundam") */
  sourceTitle?: string;

  /**
   * Effects defined on this card according to rules 5-1 and 10-1
   * An effect is text that is printed within a defined region of a card
   * and consists of a directive and related compensation
   */
  effects?: Effect[];
};

// ============================================================================
// UNIT CARD
// ============================================================================

export type UnitCardDefinition = BaseCardDefinition & {
  cardType: "UNIT";

  /** Attack points */
  ap: number;

  /** Health points */
  hp: number;

  /** Deployment zones */
  zones: Array<"space" | "earth">;

  /** Traits (e.g., ["earth-federation", "white-base"]) */
  traits: string[];

  /** Link requirements (pilot names) */
  linkRequirements?: string[];

  /** Keyword abilities */
  keywords?: KeywordAbility[];

  /** Triggered/Activated abilities */
  abilities?: ParsedAbility[];
};

// ============================================================================
// PILOT CARD
// ============================================================================

export type PilotCardDefinition = BaseCardDefinition & {
  cardType: "PILOT";

  /** Traits */
  traits: string[];

  /** AP bonus when paired */
  apModifier: number;

  /** HP bonus when paired */
  hpModifier: number;

  /** Abilities */
  abilities?: ParsedAbility[];
};

// ============================================================================
// COMMAND CARD
// ============================================================================

export type CommandCardDefinition = BaseCardDefinition & {
  cardType: "COMMAND";

  /** Timing when card can be played */
  timing: "MAIN" | "ACTION" | "BURST";

  /** Pilot properties (for commands with 【Pilot】 effect) */
  pilotProperties?: {
    name: string;
    traits: string[];
    apModifier: number;
    hpModifier: number;
  };

  /** Abilities */
  abilities?: ParsedAbility[];
};

// ============================================================================
// BASE CARD
// ============================================================================

export type BaseCardDefinition_Structure = BaseCardDefinition & {
  cardType: "BASE";

  /** Attack points */
  ap: number;

  /** Health points */
  hp: number;

  /** Deployment zones */
  zones: Array<"space" | "earth">;

  /** Traits */
  traits: string[];

  /** Abilities */
  abilities?: ParsedAbility[];
};

// ============================================================================
// RESOURCE CARD
// ============================================================================

export type ResourceCardDefinition = Omit<
  BaseCardDefinition,
  "cost" | "level" | "color"
> & {
  cardType: "RESOURCE";

  /** Whether this is an EX resource */
  isEXResource?: boolean;
};

// ============================================================================
// UNION TYPE
// ============================================================================

export type CardDefinition =
  | UnitCardDefinition
  | PilotCardDefinition
  | CommandCardDefinition
  | BaseCardDefinition_Structure
  | ResourceCardDefinition;

// ============================================================================
// TYPE GUARDS
// ============================================================================

import { createTypeGuard } from "@tcg/core/validation";

/**
 * Type guard for Unit cards
 * Built using @tcg/core's createTypeGuard utility
 */
export const isUnitCard = createTypeGuard<CardDefinition, "cardType", "UNIT">(
  "cardType",
  "UNIT",
);

/**
 * Type guard for Pilot cards
 * Built using @tcg/core's createTypeGuard utility
 */
export const isPilotCard = createTypeGuard<CardDefinition, "cardType", "PILOT">(
  "cardType",
  "PILOT",
);

/**
 * Type guard for Command cards
 * Built using @tcg/core's createTypeGuard utility
 */
export const isCommandCard = createTypeGuard<
  CardDefinition,
  "cardType",
  "COMMAND"
>("cardType", "COMMAND");

/**
 * Type guard for Base cards
 * Built using @tcg/core's createTypeGuard utility
 */
export const isBaseCard = createTypeGuard<CardDefinition, "cardType", "BASE">(
  "cardType",
  "BASE",
);

/**
 * Type guard for Resource cards
 * Built using @tcg/core's createTypeGuard utility
 */
export const isResourceCard = createTypeGuard<
  CardDefinition,
  "cardType",
  "RESOURCE"
>("cardType", "RESOURCE");
