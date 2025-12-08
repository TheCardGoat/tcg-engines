/**
 * Action Ability Parser
 *
 * Parses standalone action card effects that don't have triggers, costs, or conditions.
 * Examples:
 * - "Draw 2 cards"
 * - "Deal 3 damage to chosen character"
 * - "Banish all items"
 * - "Each opponent loses 2 lore"
 * - "Ready chosen character"
 *
 * Action effects are parsed using the same effect parser as other abilities,
 * but wrapped in an ActionAbility type.
 */

import type { ParseResult } from "../types";
import { parseEffect } from "./effect-parser";

/**
 * Parse an action ability (standalone effect)
 *
 * @param text - Normalized ability text starting with an effect verb
 * @returns ParseResult with ActionAbility or error
 *
 * @example
 * ```typescript
 * parseActionAbility("Draw 2 cards")
 * // Returns: {
 * //   success: true,
 * //   ability: {
 * //     type: "action",
 * //     effect: { type: "draw", amount: 2, target: "CONTROLLER" }
 * //   }
 * // }
 * ```
 */
export function parseActionAbility(text: string): ParseResult {
  // Try to parse the text as an effect
  const effect = parseEffect(text);

  if (!effect) {
    return {
      success: false,
      error: `Could not parse action effect: "${text}"`,
      unparsedSegments: [text],
    };
  }

  return {
    success: true,
    ability: {
      ability: {
        type: "action",
        effect,
      },
      text,
    },
  };
}
