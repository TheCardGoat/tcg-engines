import type { TargetQuery } from "../targeting/gundam-target-dsl";

// ============================================================================
// EFFECTS & KEYWORDS
// ============================================================================

export type KeywordAbility = {
  keyword: string;
  value?: number;
};

export type EffectRestriction =
  | { type: "ONCE_PER_TURN" }
  | { type: "MAX_PER_TURN"; value: number };

export type EffectCost =
  | { type: "ENERGY"; amount: number }
  | { type: "REST_SELF"; amount: number }
  | { type: "DISCARD"; amount: number }
  | { type: "RETURN_TO_HAND"; amount: number };

export type EffectCondition = {
  type: "STATE_CHECK";
  text: string;
};

export type Action =
  | { type: "SEQUENCE"; actions: Action[] }
  | {
      type: "CONDITIONAL";
      conditions: EffectCondition[];
      trueAction: Action;
      falseAction?: Action;
    }
  | { type: "DRAW"; value: number }
  | { type: "HEAL"; amount: number; target?: TargetQuery | TargetQuery[] }
  | { type: "DAMAGE"; value: number; target?: TargetQuery | TargetQuery[] }
  | {
      type: "SEARCH";
      destination: string;
      count?: number;
      filter?: Record<string, string>;
    }
  | { type: "REST"; target?: TargetQuery | TargetQuery[] }
  | { type: "STAND"; target?: TargetQuery | TargetQuery[] }
  | { type: "DEPLOY"; target?: TargetQuery | TargetQuery[] }
  | { type: "ADD_TO_HAND"; target?: TargetQuery | TargetQuery[] }
  | {
      type: "MODIFY_STATS";
      attribute: "AP" | "HP";
      value: number;
      duration: "TURN" | "PERMANENT";
      target?: TargetQuery | TargetQuery[];
    }
  | {
      type: "GAIN_KEYWORDS";
      keywords: string[];
      duration: "TURN" | "PERMANENT";
      target?: TargetQuery | TargetQuery[];
    }
  | { type: "DISCARD"; value: number; target?: TargetQuery | TargetQuery[] }
  | { type: "CUSTOM"; text: string };

export type BaseEffect = {
  id: string;
  description: string;
  restrictions?: EffectRestriction[];
  costs?: EffectCost[];
  conditions?: EffectCondition[];
  action: Action;
};

export type ActivatedEffect = BaseEffect & {
  type: "ACTIVATED";
  timing: "MAIN" | "ACTION";
};

export type TriggeredEffect = BaseEffect & {
  type: "TRIGGERED";
  timing:
    | "DEPLOY"
    | "ATTACK"
    | "DESTROYED"
    | "WHEN_PAIRED"
    | "WHEN_LINKED"
    | "BURST";
};

export type ConstantEffect = BaseEffect & {
  type: "CONSTANT";
};

export type Effect = ActivatedEffect | TriggeredEffect | ConstantEffect;

// ============================================================================
// BASE CARD DEFINITION
// ============================================================================

export type RawCardDefinition = {
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

  /** Parsed keyword abilities */
  keywords?: KeywordAbility[];

  /** Parsed structured effects */
  effects?: Effect[];

  /** Card image URL */
  imageUrl?: string;

  /** Source title (e.g., "Mobile Suit Gundam") */
  sourceTitle?: string;
};

// ============================================================================
// UNIT CARD
// ============================================================================

export type UnitCardDefinition = RawCardDefinition & {
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

export type PilotCardDefinition = RawCardDefinition & {
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

export type CommandCardDefinition = RawCardDefinition & {
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

export type BaseCardDefinition = RawCardDefinition & {
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
  RawCardDefinition,
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
  | BaseCardDefinition
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
