/**
 * Triggered ability parser stub for v2 tests.
 */

import { parserV2 } from "../index";

interface ParseResult {
  success: boolean;
  ability?: { ability: unknown };
  warnings: string[];
}

/**
 * Parse triggered ability using the v2 parser.
 */
export function parseTriggeredAbility(text: string): ParseResult {
  const ability = parserV2.parseAbility(text);
  if (ability?.type === "triggered") {
    return {
      success: true,
      ability: { ability },
      warnings: [],
    };
  }
  return {
    success: false,
    warnings: ["Failed to parse triggered ability"],
  };
}
