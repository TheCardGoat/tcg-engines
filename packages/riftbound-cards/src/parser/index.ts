/**
 * Riftbound Ability Parser
 *
 * Parser for converting card ability text to structured ability objects.
 */

import type {
  Ability,
  AbilityWithText,
  SimpleKeyword,
  SimpleKeywordAbility,
  SpellAbility,
  ValueKeyword,
  ValueKeywordAbility,
} from "@tcg/riftbound-types";
import type { DrawEffect } from "@tcg/riftbound-types/abilities/effect-types";

/**
 * Options for controlling parser behavior and output
 */
export interface ParserOptions {
  /** Omit the 'id' field from AbilityWithText results */
  readonly omitId?: boolean;
  /** Omit the 'text' field from AbilityWithText results */
  readonly omitText?: boolean;
  /** Card ID prefix for generating ability IDs (e.g., "card-1") */
  readonly cardId?: string;
  /** Generate unique IDs for abilities */
  readonly generateAbilityUids?: boolean;
}

/**
 * Result of parsing a single ability text
 */
export interface ParseResult {
  readonly success: boolean;
  readonly ability?: Ability;
  readonly error?: string;
}

/**
 * Result of parsing ability text that may contain multiple abilities
 */
export interface ParseAbilitiesResult {
  readonly success: boolean;
  readonly abilities?: AbilityWithText[];
  readonly error?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Simple keywords that have no parameters
 */
const SIMPLE_KEYWORDS: readonly SimpleKeyword[] = [
  "Tank",
  "Ganking",
  "Action",
  "Reaction",
  "Hidden",
  "Temporary",
  "Quick-Draw",
  "Weaponmaster",
  "Unique",
] as const;

/**
 * Value keywords that have optional numeric values
 */
const VALUE_KEYWORDS: readonly ValueKeyword[] = [
  "Assault",
  "Shield",
  "Deflect",
] as const;

// ============================================================================
// Regex Patterns
// ============================================================================

/**
 * Pattern to match simple keywords: [KeywordName]
 */
const SIMPLE_KEYWORD_PATTERN = new RegExp(
  `\\[(${SIMPLE_KEYWORDS.join("|")})\\]`,
  "g",
);

/**
 * Pattern to match value keywords: [KeywordName] or [KeywordName N]
 */
const VALUE_KEYWORD_PATTERN = new RegExp(
  `\\[(${VALUE_KEYWORDS.join("|")})(?:\\s+(\\d+))?\\]`,
  "g",
);

/**
 * Pattern to match reminder text in parentheses
 */
const REMINDER_TEXT_PATTERN = /\([^)]*\)/g;

/**
 * Pattern to match draw effects: "Draw N."
 */
const DRAW_PATTERN = /^Draw (\d+)\.?$/i;

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Remove reminder text (text in parentheses) from ability text
 */
function removeReminderText(text: string): string {
  return text.replace(REMINDER_TEXT_PATTERN, "").trim();
}

/**
 * Parse simple keywords from text
 */
function parseSimpleKeywords(text: string): SimpleKeywordAbility[] {
  const abilities: SimpleKeywordAbility[] = [];
  const cleanText = removeReminderText(text);

  let match: RegExpExecArray | null;
  const pattern = new RegExp(SIMPLE_KEYWORD_PATTERN.source, "g");

  while ((match = pattern.exec(cleanText)) !== null) {
    const keyword = match[1] as SimpleKeyword;
    abilities.push({
      type: "keyword",
      keyword,
    });
  }

  return abilities;
}

/**
 * Parse value keywords from text
 */
function parseValueKeywords(text: string): ValueKeywordAbility[] {
  const abilities: ValueKeywordAbility[] = [];
  const cleanText = removeReminderText(text);

  let match: RegExpExecArray | null;
  const pattern = new RegExp(VALUE_KEYWORD_PATTERN.source, "g");

  while ((match = pattern.exec(cleanText)) !== null) {
    const keyword = match[1] as ValueKeyword;
    const value = match[2] ? Number.parseInt(match[2], 10) : 1;
    abilities.push({
      type: "keyword",
      keyword,
      value,
    });
  }

  return abilities;
}

/**
 * Parse draw effect from text
 * @param text - The text to parse (should be cleaned of reminder text)
 * @returns DrawEffect if matched, undefined otherwise
 */
function parseDrawEffect(text: string): DrawEffect | undefined {
  const match = DRAW_PATTERN.exec(text);
  if (match) {
    const amount = Number.parseInt(match[1], 10);
    return {
      type: "draw",
      amount,
    };
  }
  return undefined;
}

/**
 * Parse effect from text and wrap in SpellAbility
 * @param text - The text to parse
 * @returns SpellAbility if an effect was parsed, undefined otherwise
 */
function parseEffectAsSpell(text: string): SpellAbility | undefined {
  const cleanText = removeReminderText(text);

  // Try draw effect
  const drawEffect = parseDrawEffect(cleanText);
  if (drawEffect) {
    return {
      type: "spell",
      timing: "action",
      effect: drawEffect,
    };
  }

  return undefined;
}

/**
 * Parse ability text into a structured ability object.
 *
 * @param text - The ability text to parse
 * @returns ParseResult with the parsed ability or error
 *
 * @example
 * ```typescript
 * const result = parseAbilityText("Rush");
 * if (result.success) {
 *   console.log(result.ability);
 * }
 * ```
 */
export function parseAbilityText(text: string): ParseResult {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: "Empty ability text",
    };
  }

  // Try parsing as simple keyword first
  const simpleKeywords = parseSimpleKeywords(text);
  if (simpleKeywords.length > 0) {
    return {
      success: true,
      ability: simpleKeywords[0],
    };
  }

  // Try parsing as value keyword
  const valueKeywords = parseValueKeywords(text);
  if (valueKeywords.length > 0) {
    return {
      success: true,
      ability: valueKeywords[0],
    };
  }

  return {
    success: false,
    error: "Unable to parse ability text",
  };
}

/**
 * Generate an ability ID from card ID and index
 * @param cardId - Card ID prefix (e.g., "card-1")
 * @param index - 1-based ability index
 * @returns Ability ID (e.g., "card-1-1")
 */
function generateAbilityId(cardId: string, index: number): string {
  return `${cardId}-${index}`;
}

/**
 * Build an AbilityWithText object based on parser options
 * @param ability - The parsed ability
 * @param text - The original ability text
 * @param options - Parser options
 * @param index - 1-based ability index (for multi-ability parsing)
 * @returns AbilityWithText with fields conditionally included based on options
 */
export function buildAbilityWithText(
  ability: Ability,
  text: string,
  options?: ParserOptions,
  index = 1,
): AbilityWithText {
  const result: { ability: Ability; text?: string; id?: string } = { ability };

  // Include text unless omitText is true
  if (!options?.omitText) {
    result.text = text;
  }

  // Include id if generateAbilityUids is true and cardId is provided, unless omitId is true
  if (options?.generateAbilityUids && options?.cardId && !options?.omitId) {
    result.id = generateAbilityId(options.cardId, index);
  }

  return result as AbilityWithText;
}

/**
 * Parse ability text that may contain multiple abilities.
 *
 * Card text often contains multiple abilities separated by line breaks or
 * specific patterns. This function parses all abilities from the text.
 *
 * @param text - The ability text to parse (may contain multiple abilities)
 * @param options - Optional parser options to control output fields
 * @returns ParseAbilitiesResult with all parsed abilities or error
 *
 * @example
 * ```typescript
 * const result = parseAbilities("[Assault 2] (+2 :rb_might: while I'm an attacker.)");
 * if (result.success) {
 *   console.log(result.abilities); // [{ type: "keyword", keyword: "Assault", value: 2 }]
 * }
 * ```
 */
export function parseAbilities(
  text: string,
  _options?: ParserOptions,
): ParseAbilitiesResult {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: "Empty ability text",
    };
  }

  const abilities: Ability[] = [];

  // Parse simple keywords
  const simpleKeywords = parseSimpleKeywords(text);
  abilities.push(...simpleKeywords);

  // Parse value keywords
  const valueKeywords = parseValueKeywords(text);
  abilities.push(...valueKeywords);

  // If no keywords found, try parsing as an effect
  if (abilities.length === 0) {
    const spellAbility = parseEffectAsSpell(text);
    if (spellAbility) {
      abilities.push(spellAbility);
    }
  }

  if (abilities.length === 0) {
    return {
      success: false,
      error: "No abilities found in text",
    };
  }

  return {
    success: true,
    abilities,
  };
}

/**
 * Validate ability text without fully parsing
 *
 * @param text - The ability text to validate
 * @returns true if the text appears to be valid ability text
 */
export function validateAbilityText(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }
  return true;
}
