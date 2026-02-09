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
