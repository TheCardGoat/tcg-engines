/**
 * Triggered ability parser for v2.
 * Wraps the main v2 parser for triggered ability parsing.
 */

import { parserV2 } from "../index";

interface ParseResult {
  success: boolean;
  ability?: { name?: string; ability: unknown; text?: string };
  warnings: string[];
}

/**
 * Extract ability name from text if present.
 * Pattern: "NAME TRIGGER, EFFECT" where NAME is all caps.
 * Also handles restriction prefixes: "NAME Once per turn, when X, do Y"
 */
function extractAbilityName(text: string): string | undefined {
  // Match pattern: ALL_CAPS_NAME followed by optional restriction prefix and trigger word
  // Allow common punctuation in names like "IT WORKS!", "FINE PRINT"
  const nameMatch = text.match(
    /^([A-Z][A-Z\s!?'-]+)\s+(?:Once per turn,\s*)?(?:During your turn,\s*)?(When|Whenever)/i,
  );
  if (nameMatch) {
    return nameMatch[1].trim();
  }
  return undefined;
}

/**
 * Parse triggered ability using the v2 parser.
 * Note: Returns success for any ability that parses successfully,
 * not just triggered abilities.
 */
export function parseTriggeredAbility(text: string): ParseResult {
  const name = extractAbilityName(text);
  const ability = parserV2.parseAbility(text);
  if (ability) {
    return {
      ability: { ability, name, text },
      success: true,
      warnings: [],
    };
  }
  return {
    success: false,
    warnings: ["Failed to parse ability"],
  };
}
