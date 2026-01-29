/**
 * Card Type Definitions for Gundam Card Game
 *
 * These types define the structure of card definitions in the @tcg/gundam engine.
 * All cards are plain data objects following @tcg/core patterns.
 */

import type { CardTarget } from "../targeting/gundam-target-dsl";

// ============================================================================
// EFFECT TYPES
// ============================================================================

/**
 * Effect restrictions that limit how often an effect can be used
 */
export interface EffectRestriction {
  type: "ONCE_PER_TURN" | "ONCE_PER_GAME" | "MAX_PER_TURN";
  value?: number; // For MAX_PER_TURN
}

export type EffectConditions = "DURING_PAIR" | "DURING_LINK";

export interface EffectCondition {
  type:
    | "STATE_CHECK"
    | "LOCATION_CHECK"
    | "COMPARISON"
    | "HAS_UNIT"
    | "HAS_CARD";
  // Add more as needed
  [key: string]: unknown;
}

export interface EffectCost {
  type:
    | "ENERGY"
    | "DISCARD"
    | "REST_SELF"
    | "RETURN_TO_HAND"
    | "DESTROY_SELF"
    | "REMOVE_FROM_GRAVEYARD";
  amount?: number;
  target?: CardTarget;
}

// --- Actions ---

export type EffectActionType =
  | "DRAW"
  | "DAMAGE"
  | "HEAL"
  | "REST"
  | "STAND"
  | "DESTROY"
  | "SEARCH"
  | "ADD_TO_HAND"
  | "DISCARD"
  | "MODIFY_STATS"
  | "GAIN_KEYWORDS"
  | "REMOVE_KEYWORDS"
  | "SWITCH_CONTROL"
  | "PREVENT_DAMAGE"
  | "DEPLOY"
  | "CREATE_TOKEN"
  | "SEQUENCE"
  | "CONDITIONAL"
  | "CUSTOM";

export interface BaseAction {
  type: EffectActionType;
}

export interface HealAction extends BaseAction {
  type: "HEAL";
  amount: number;
  target?: CardTarget | CardTarget[];
}

export interface DamageAction extends BaseAction {
  type: "DAMAGE";
  value: number;
  target?: CardTarget | CardTarget[];
}

export interface DrawAction extends BaseAction {
  type: "DRAW";
  value: number;
  target?: CardTarget;
}

export interface SearchAction extends BaseAction {
  type: "SEARCH";
  filter?: Record<string, unknown>; // Should use proper filter type eventually
  destination: "hand" | "deck" | "discard" | "field";
  count: number;
}

export interface ModifyStatsAction extends BaseAction {
  type: "MODIFY_STATS";
  attribute: "AP" | "HP" | "BOTH";
  value: number;
  duration: "TURN" | "PERMANENT";
  target?: CardTarget | CardTarget[];
}

export interface CustomAction extends BaseAction {
  type: "CUSTOM";
  text: string;
}

export interface SequenceAction extends BaseAction {
  type: "SEQUENCE";
  actions: Action[];
}

export interface ConditionalAction extends BaseAction {
  type: "CONDITIONAL";
  conditions: EffectCondition[];
  trueAction: Action;
  falseAction?: Action;
}

// Generic Action for now to cover all cases without huge boilerplate
// Or I can define a union of specific actions + GenericAction
export interface GenericAction extends BaseAction {
  type: Exclude<
    EffectActionType,
    | "HEAL"
    | "DAMAGE"
    | "DRAW"
    | "SEARCH"
    | "MODIFY_STATS"
    | "CUSTOM"
    | "SEQUENCE"
    | "CONDITIONAL"
    | "GAIN_KEYWORDS"
  >;
  target?: CardTarget | CardTarget[];
  value?: number;
  parameters?: Record<string, unknown>;
  text?: string;
}

export type Action =
  | HealAction
  | DamageAction
  | DrawAction
  | SearchAction
  | ModifyStatsAction
  | CustomAction
  | SequenceAction
  | ConditionalAction
  | GenericAction;

// Compatibility alias
export type EffectAction = Action;

// --- Effects ---

/**
 * Base effect structure
 */
export interface BaseEffect {
  /** Unique identifier for this effect */
  id: string;

  /** Human-readable description (original card text) */
  description: string;

  /** Whether this effect is mandatory or optional */
  optional?: boolean;

  /** Target location where effect can be activated (default: field only) */
  targetLocation?: "field" | "hand" | "deck" | "discard" | "any";

  /** Effect restrictions that limit usage */
  restrictions?: EffectRestriction[];

  /** Activation costs */
  costs?: EffectCost[];

  /** Conditions for usage */
  conditions?: EffectCondition[];

  /** The action to perform */
  action: Action;
}

/**
 * Constant Effect
 */
export interface ConstantEffect extends BaseEffect {
  type: "CONSTANT";
  // conditions field in BaseEffect covers usage conditions

  /** Whether effect has conditional targets applied when conditions appear */
  hasConditionalTargets?: boolean;

  /** Whether this effect takes precedence over conflicting effects */
  precedence?: boolean;
}

/**
 * Triggered Effect
 */
export interface TriggeredEffect extends BaseEffect {
  type: "TRIGGERED";
  timing:
    | "DEPLOY"
    | "ATTACK"
    | "DESTROYED"
    | "WHEN_PAIRED"
    | "WHEN_LINKED"
    | "BURST";
  customTrigger?: string;
  persistsAfterLeaving?: boolean;
}

/**
 * Activated Effect
 */
export interface ActivatedEffect extends BaseEffect {
  type: "ACTIVATED";
  timing: "MAIN" | "ACTION";
  requiresDeclaration?: boolean;
}

/**
 * Command Effect
 */
export interface CommandEffect extends BaseEffect {
  type: "COMMAND";
  timing: "MAIN" | "ACTION" | "BURST";
  requiresTarget?: boolean;
  targetRequirements?: string[];
}

/**
 * Substitution Effect
 */
export interface SubstitutionEffect extends BaseEffect {
  type: "SUBSTITUTION";
  originalEvent: string;
  replacementEvent: string;
}

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

  /** Keyword abilities */
  keywords?: KeywordAbility[];
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
