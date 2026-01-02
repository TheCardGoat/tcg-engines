/**
 * Triggered ability parser for v2.
 * Wraps the main v2 parser for triggered ability parsing.
 */

import { parserV2 } from "../index";

interface ParseResult {
  success: boolean;
  ability?: { ability: unknown; text?: string };
  warnings: string[];
}

/**
 * Parse triggered ability using the v2 parser.
 * Note: Returns success for any ability that parses successfully,
 * not just triggered abilities.
 */
export function parseTriggeredAbility(text: string): ParseResult {
  const ability = parserV2.parseAbility(text);
  if (ability) {
    return {
      success: true,
      ability: { ability, text },
      warnings: [],
    };
  }
  return {
    success: false,
    warnings: ["Failed to parse ability"],
  };
}
