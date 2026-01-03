/**
 * Keyword ability parser stub for v2 tests.
 */

import { parseKeywordAbility as parseKeywordAbilityInternal } from "../keyword-ability-parser";

interface ParseResult {
  success: boolean;
  ability?: { ability: unknown };
  error?: string;
}

/**
 * Parse keyword ability using the keyword ability parser.
 */
export function parseKeywordAbility(text: string): ParseResult {
  const ability = parseKeywordAbilityInternal(text);
  if (ability) {
    return {
      success: true,
      ability: { ability },
    };
  }
  return {
    success: false,
    error: "Failed to parse keyword ability",
  };
}
