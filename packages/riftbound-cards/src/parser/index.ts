/**
 * Riftbound Ability Parser
 *
 * Parser for converting card ability text to structured ability objects.
 */

import type { Ability } from "@tcg/riftbound-types";

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
  readonly abilities?: Ability[];
  readonly error?: string;
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
  // Placeholder implementation - parser will be implemented as game rules are defined
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: "Empty ability text",
    };
  }

  // Basic keyword parsing placeholder
  const trimmed = text.trim();

  // TODO: Implement proper parser to determine keyword type and parse parameters
  // For now, return a simple keyword ability with type assertion
  // This is a placeholder and will be replaced with actual parser implementation
  return {
    success: true,
    ability: {
      type: "keyword",
      keyword: "Action",
    },
  };
}

/**
 * Parse ability text that may contain multiple abilities.
 *
 * Card text often contains multiple abilities separated by line breaks or
 * specific patterns. This function parses all abilities from the text.
 *
 * @param text - The ability text to parse (may contain multiple abilities)
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
export function parseAbilities(text: string): ParseAbilitiesResult {
  // Placeholder implementation - parser will be implemented using TDD
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: "Empty ability text",
    };
  }

  // TODO: Implement proper parser using TDD
  // The tests will guide the implementation
  return {
    success: false,
    error: "Parser not yet implemented",
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
