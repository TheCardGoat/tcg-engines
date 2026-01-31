/**
 * TestCardBuilder - Utility for creating test cards
 *
 * Creates CardDefinition objects compatible with @tcg/riftbound-types
 * for use in test scenarios. Supports units, spells, and battlefields.
 *
 * @example
 * ```typescript
 * const builder = new TestCardBuilder();
 *
 * // Create a unit with keywords
 * const warrior = builder.createTestUnit({
 *   might: 4,
 *   domain: "fury",
 *   keywords: ["Assault 2", "Tank"],
 * });
 *
 * // Create a spell
 * const bolt = builder.createTestSpell({
 *   cost: { energy: 2, power: ["fury"] },
 *   timing: "action",
 * });
 *
 * // Create a battlefield
 * const ruins = builder.createTestBattlefield({
 *   abilities: ["When you conquer, draw 1"],
 * });
 * ```
 */

import type {
  Ability,
  BattlefieldCard,
  CardId,
  Domain,
  KeywordAbility,
  SimpleKeyword,
  SpellCard,
  SpellTiming,
  UnitCard,
  ValueKeyword,
} from "@tcg/riftbound-types";

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Configuration for creating a test unit card
 */
export interface TestUnitCardConfig {
  /** Card ID (auto-generated if not provided) */
  id?: string;
  /** Card name (auto-generated if not provided) */
  name?: string;
  /** Unit's might (default: 3) */
  might?: number;
  /** Energy cost (default: 0) */
  energyCost?: number;
  /** Domain identity */
  domain?: Domain;
  /** Power cost (domains required) */
  powerCost?: Domain[];
  /** Keywords as strings (e.g., ["Assault 2", "Tank", "Shield 3"]) */
  keywords?: string[];
  /** Raw ability text (stored but not parsed) */
  abilities?: string[];
  /** Unit tags (e.g., ["Mech", "Dragon"]) */
  tags?: string[];
  /** Whether this is a token */
  isToken?: boolean;
  /** Whether this is a Champion unit */
  isChampion?: boolean;
}

/**
 * Configuration for creating a test spell card
 */
export interface TestSpellCardConfig {
  /** Card ID (auto-generated if not provided) */
  id?: string;
  /** Card name (auto-generated if not provided) */
  name?: string;
  /** Cost configuration */
  cost?: {
    /** Energy cost */
    energy?: number;
    /** Power cost (domains required) */
    power?: Domain[];
  };
  /** Spell timing (default: "action") */
  timing?: SpellTiming;
  /** Effect description (stored as rules text) */
  effect?: string;
  /** Whether this spell has Hidden */
  hasHidden?: boolean;
}

/**
 * Configuration for creating a test battlefield card
 */
export interface TestBattlefieldCardConfig {
  /** Card ID (auto-generated if not provided) */
  id?: string;
  /** Card name (auto-generated if not provided) */
  name?: string;
  /** Ability descriptions (stored as rules text) */
  abilities?: string[];
}

// =============================================================================
// Keyword Parsing Utilities
// =============================================================================

/** Simple keywords that don't take parameters */
const SIMPLE_KEYWORDS: SimpleKeyword[] = [
  "Tank",
  "Ganking",
  "Action",
  "Reaction",
  "Hidden",
  "Temporary",
  "Quick-Draw",
  "Weaponmaster",
  "Unique",
];

/** Value keywords that take a numeric parameter */
const VALUE_KEYWORDS: ValueKeyword[] = ["Assault", "Shield", "Deflect"];

/**
 * Parse a keyword string into a KeywordAbility object
 *
 * @param keywordStr - Keyword string (e.g., "Assault 2", "Tank")
 * @returns KeywordAbility object or null if invalid
 *
 * @example
 * parseKeyword("Assault 2") // { type: "keyword", keyword: "Assault", value: 2 }
 * parseKeyword("Tank")      // { type: "keyword", keyword: "Tank" }
 */
function parseKeyword(keywordStr: string): KeywordAbility | null {
  const trimmed = keywordStr.trim();

  // Check for value keywords (e.g., "Assault 2")
  for (const valueKw of VALUE_KEYWORDS) {
    const regex = new RegExp(`^${valueKw}\\s+(\\d+)$`, "i");
    const match = trimmed.match(regex);
    if (match) {
      return {
        type: "keyword",
        keyword: valueKw,
        value: Number.parseInt(match[1], 10),
      };
    }
  }

  // Check for simple keywords
  for (const simpleKw of SIMPLE_KEYWORDS) {
    if (trimmed.toLowerCase() === simpleKw.toLowerCase()) {
      return {
        type: "keyword",
        keyword: simpleKw,
      };
    }
  }

  // Check if it's a value keyword without a value (default to 1)
  for (const valueKw of VALUE_KEYWORDS) {
    if (trimmed.toLowerCase() === valueKw.toLowerCase()) {
      return {
        type: "keyword",
        keyword: valueKw,
        value: 1,
      };
    }
  }

  return null;
}

/**
 * Parse multiple keyword strings into KeywordAbility objects
 *
 * @param keywords - Array of keyword strings
 * @returns Array of KeywordAbility objects (invalid keywords are filtered out)
 */
function parseKeywords(keywords: string[]): KeywordAbility[] {
  const abilities: KeywordAbility[] = [];
  for (const kw of keywords) {
    const parsed = parseKeyword(kw);
    if (parsed) {
      abilities.push(parsed);
    }
  }
  return abilities;
}

/**
 * Extract keyword names from KeywordAbility objects
 *
 * @param abilities - Array of abilities
 * @returns Array of keyword names as strings
 */
export function extractKeywordNames(abilities: Ability[]): string[] {
  const keywords: string[] = [];
  for (const ability of abilities) {
    if (ability.type === "keyword") {
      const kw = ability as KeywordAbility;
      if ("value" in kw) {
        keywords.push(`${kw.keyword} ${kw.value}`);
      } else {
        keywords.push(kw.keyword);
      }
    }
  }
  return keywords;
}

// =============================================================================
// TestCardBuilder Class
// =============================================================================

/**
 * TestCardBuilder - Creates test cards for Riftbound tests
 *
 * Generates CardDefinition objects compatible with @tcg/riftbound-types.
 * Uses auto-incrementing IDs and sensible defaults for easy test setup.
 */
export class TestCardBuilder {
  private _unitCounter = 0;
  private _spellCounter = 0;
  private _battlefieldCounter = 0;

  /**
   * Create a test unit card
   *
   * @param config - Unit configuration
   * @returns UnitCard definition
   *
   * @example
   * ```typescript
   * const builder = new TestCardBuilder();
   *
   * // Simple unit
   * const unit = builder.createTestUnit({ might: 4 });
   *
   * // Unit with keywords
   * const warrior = builder.createTestUnit({
   *   might: 5,
   *   domain: "fury",
   *   keywords: ["Assault 2", "Tank"],
   *   tags: ["Warrior"],
   * });
   * ```
   */
  createTestUnit(config: TestUnitCardConfig = {}): UnitCard {
    this._unitCounter++;
    const id = config.id ?? `test-unit-${this._unitCounter}`;
    const name = config.name ?? `Test Unit ${this._unitCounter}`;

    // Parse keywords into abilities
    const keywordAbilities = config.keywords
      ? parseKeywords(config.keywords)
      : [];

    // Combine keyword abilities with any raw ability text
    // Note: Raw ability text is stored in rulesText, not parsed
    const abilities: Ability[] = [...keywordAbilities];

    const unit: UnitCard = {
      id: id as CardId,
      name,
      cardType: "unit",
      might: config.might ?? 3,
      energyCost: config.energyCost,
      powerCost: config.powerCost,
      abilities: abilities.length > 0 ? abilities : undefined,
      rulesText: config.abilities?.join("\n"),
      domain: config.domain,
      tags: config.tags,
      isToken: config.isToken,
      isChampion: config.isChampion,
    };

    return unit;
  }

  /**
   * Create a test spell card
   *
   * @param config - Spell configuration
   * @returns SpellCard definition
   *
   * @example
   * ```typescript
   * const builder = new TestCardBuilder();
   *
   * // Action spell
   * const bolt = builder.createTestSpell({
   *   cost: { energy: 2, power: ["fury"] },
   *   timing: "action",
   *   effect: "Deal 3 damage to a unit",
   * });
   *
   * // Reaction spell
   * const counter = builder.createTestSpell({
   *   timing: "reaction",
   *   effect: "Counter target spell",
   * });
   * ```
   */
  createTestSpell(config: TestSpellCardConfig = {}): SpellCard {
    this._spellCounter++;
    const id = config.id ?? `test-spell-${this._spellCounter}`;
    const name = config.name ?? `Test Spell ${this._spellCounter}`;

    const spell: SpellCard = {
      id: id as CardId,
      name,
      cardType: "spell",
      timing: config.timing ?? "action",
      energyCost: config.cost?.energy,
      powerCost: config.cost?.power,
      rulesText: config.effect,
      hasHidden: config.hasHidden,
    };

    return spell;
  }

  /**
   * Create a test battlefield card
   *
   * @param config - Battlefield configuration
   * @returns BattlefieldCard definition
   *
   * @example
   * ```typescript
   * const builder = new TestCardBuilder();
   *
   * // Simple battlefield
   * const field = builder.createTestBattlefield({});
   *
   * // Battlefield with abilities
   * const ruins = builder.createTestBattlefield({
   *   name: "Ancient Ruins",
   *   abilities: ["When you conquer, draw 1"],
   * });
   * ```
   */
  createTestBattlefield(
    config: TestBattlefieldCardConfig = {},
  ): BattlefieldCard {
    this._battlefieldCounter++;
    const id = config.id ?? `test-battlefield-${this._battlefieldCounter}`;
    const name = config.name ?? `Test Battlefield ${this._battlefieldCounter}`;

    const battlefield: BattlefieldCard = {
      id: id as CardId,
      name,
      cardType: "battlefield",
      rulesText: config.abilities?.join("\n"),
    };

    return battlefield;
  }

  /**
   * Reset all counters
   *
   * Useful for ensuring consistent IDs across test runs.
   */
  reset(): void {
    this._unitCounter = 0;
    this._spellCounter = 0;
    this._battlefieldCounter = 0;
  }

  /**
   * Get the current unit counter value
   */
  get unitCount(): number {
    return this._unitCounter;
  }

  /**
   * Get the current spell counter value
   */
  get spellCount(): number {
    return this._spellCounter;
  }

  /**
   * Get the current battlefield counter value
   */
  get battlefieldCount(): number {
    return this._battlefieldCounter;
  }
}

/**
 * Default TestCardBuilder instance for convenience
 *
 * @example
 * ```typescript
 * import { testCardBuilder } from "./test-card-builder";
 *
 * const unit = testCardBuilder.createTestUnit({ might: 4 });
 * ```
 */
export const testCardBuilder = new TestCardBuilder();
