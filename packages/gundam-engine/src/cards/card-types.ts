/**
 * Card Type Definitions for Gundam Card Game
 *
 * These types define the structure of card definitions in the @tcg/gundam engine.
 * All cards are plain data objects following @tcg/core patterns.
 */

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
    | "High-Maneuver";
  value?: number;
};

export type ParsedAbility = {
  // Timing/trigger information
  trigger?:
    | "ON_DEPLOY"
    | "ON_ATTACK"
    | "ON_DESTROY"
    | "WHEN_PAIRED"
    | "DURING_PAIR"
    | "ON_BURST";

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

export function isUnitCard(card: CardDefinition): card is UnitCardDefinition {
  return card.cardType === "UNIT";
}

export function isPilotCard(card: CardDefinition): card is PilotCardDefinition {
  return card.cardType === "PILOT";
}

export function isCommandCard(
  card: CardDefinition,
): card is CommandCardDefinition {
  return card.cardType === "COMMAND";
}

export function isBaseCard(
  card: CardDefinition,
): card is BaseCardDefinition_Structure {
  return card.cardType === "BASE";
}

export function isResourceCard(
  card: CardDefinition,
): card is ResourceCardDefinition {
  return card.cardType === "RESOURCE";
}
