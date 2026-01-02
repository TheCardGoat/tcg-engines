/**
 * Static ability parser stub for v2 tests.
 */

import { parserV2 } from "../index";

interface ParseResult {
  success: boolean;
  ability?: { ability: unknown };
  warnings: string[];
}

/**
 * Parse static ability using the v2 parser.
 */
export function parseStaticAbility(text: string): ParseResult {
  const ability = parserV2.parseAbility(text);
  if (ability?.type === "static") {
    return {
      success: true,
      ability: { ability },
      warnings: [],
    };
  }
  return {
    success: false,
    warnings: ["Failed to parse static ability"],
  };
}
