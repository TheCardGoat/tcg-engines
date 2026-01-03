/**
 * Parser stub for v2 tests.
 * Provides compatibility with the old parser API.
 */

import { parserV2 } from "./index";
import { MANUAL_ENTRIES_BY_NAME } from "./manual-overrides";

interface ParseOptions {
  cardName?: string;
}

interface ParseResult {
  success: boolean;
  ability?: { name?: string; ability: unknown } | null;
  text: string;
  warnings: string[];
}

/**
 * Parse ability text - old API compatibility.
 */
export function parseAbilityText(
  text: string,
  options?: ParseOptions,
): ParseResult {
  // Check for manual override by card name
  if (options?.cardName && MANUAL_ENTRIES_BY_NAME[options.cardName]) {
    const entry = MANUAL_ENTRIES_BY_NAME[options.cardName];
    // entry can be AbilityWithText or AbilityWithText[]
    const singleEntry = Array.isArray(entry) ? entry[0] : entry;
    return {
      success: true,
      ability: {
        name: (singleEntry as any).name,
        ability: (singleEntry as any).ability,
      },
      text,
      warnings: [],
    };
  }

  const ability = parserV2.parseAbility(text);
  if (ability) {
    // Extract name from ability if present (for named abilities)
    const name = (ability as { name?: string }).name;
    return {
      success: true,
      ability: { name, ability },
      text,
      warnings: [],
    };
  }
  return {
    success: false,
    ability: null,
    text,
    warnings: ["Failed to parse ability"],
  };
}

interface BatchResult {
  results: ParseResult[];
  total: number;
  successful: number;
  failed: number;
}

/**
 * Parse multiple ability texts.
 */
export function parseAbilityTexts(texts: string[]): BatchResult {
  const results = texts.map((text) => parseAbilityText(text));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    results,
    total: texts.length,
    successful,
    failed,
  };
}
