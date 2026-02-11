/**
 * Keyword Parser
 *
 * Parses keyword abilities including simple, value, and cost keywords.
 */

import type {
  CostKeyword,
  CostKeywordAbility,
  SimpleKeyword,
  SimpleKeywordAbility,
  ValueKeyword,
  ValueKeywordAbility,
} from "@tcg/riftbound-types";
import type { Cost } from "@tcg/riftbound-types/abilities/cost-types";
import { extractAndParseCost, mergeCosts, parseAdditionalCostText, parseCost } from "./cost-parser";

// ============================================================================
// Constants
// ============================================================================

/**
 * Cost keywords that have an associated cost
 */
export const COST_KEYWORDS: readonly CostKeyword[] = ["Accelerate", "Equip", "Repeat"] as const;

// ============================================================================
// Cost Keyword Parsing
// ============================================================================

/**
 * Pattern to match cost keywords with their reminder text
 * Captures: [1] keyword name, [2] everything after until next keyword or end
 */
const COST_KEYWORD_PATTERN = /\[(Accelerate|Equip|Repeat)\]([^[]*?)(?=\[|$)/g;

/**
 * Pattern to extract cost from Accelerate reminder text
 * "You may pay <cost> as an additional cost..."
 */
const ACCELERATE_COST_PATTERN =
  /You may pay\s+((?::rb_(?:energy_\d+|rune_(?:fury|calm|mind|body|chaos|order|rainbow)):)+)/i;

/**
 * Pattern to extract cost from Equip text
 * "[Equip] <cost>" or "[Equip] — <cost>, <additional>"
 */
const EQUIP_COST_PATTERN =
  /^\s*(?:—\s*)?((?::rb_(?:energy_\d+|rune_(?:fury|calm|mind|body|chaos|order|rainbow)):)+)/;

/**
 * Pattern to extract cost from Repeat text
 * "[Repeat] <cost>"
 */
const REPEAT_COST_PATTERN =
  /^\s*((?::rb_(?:energy_\d+|rune_(?:fury|calm|mind|body|chaos|order|rainbow)):)+)/;

/**
 * Parse a cost keyword and extract its cost
 *
 * @param keyword - The cost keyword type
 * @param followingText - Text following the keyword (includes reminder text)
 * @returns CostKeywordAbility or null if parsing fails
 */
export function parseCostKeyword(
  keyword: CostKeyword,
  followingText: string,
): CostKeywordAbility | null {
  let cost: Cost | null = null;

  switch (keyword) {
    case "Accelerate": {
      // For Accelerate, cost is in reminder text: "(You may pay <cost> as an additional cost...)"
      const reminderMatch = followingText.match(/\([^)]*\)/);
      if (reminderMatch) {
        const costMatch = reminderMatch[0].match(ACCELERATE_COST_PATTERN);
        if (costMatch) {
          cost = parseCost(costMatch[1]);
        }
      }
      break;
    }

    case "Equip": {
      // For Equip, cost appears directly after keyword or after "—"
      // Handle both "[Equip] :rb_rune_body:" and "[Equip] — :rb_rune_chaos:, Recycle 2 cards"
      const costMatch = followingText.match(EQUIP_COST_PATTERN);
      if (costMatch) {
        cost = parseCost(costMatch[1]);

        // Check for additional costs like "Recycle N cards" or "Kill a friendly unit"
        const additionalText = followingText.slice(costMatch[0].length);
        if (additionalText.includes(",")) {
          const additionalCost = parseAdditionalCostText(additionalText);
          if (Object.keys(additionalCost).length > 0) {
            cost = mergeCosts(cost, additionalCost);
          }
        }
      }
      break;
    }

    case "Repeat": {
      // For Repeat, cost appears directly after keyword
      const costMatch = followingText.match(REPEAT_COST_PATTERN);
      if (costMatch) {
        cost = parseCost(costMatch[1]);
      }
      break;
    }
  }

  if (!cost) {
    return null;
  }

  return {
    cost,
    keyword,
    type: "keyword",
  };
}

/**
 * Extract all cost keyword abilities from text
 *
 * @param text - Full ability text
 * @returns Array of parsed cost keyword abilities with their positions
 */
export function parseCostKeywords(
  text: string,
): { ability: CostKeywordAbility; startIndex: number }[] {
  const results: { ability: CostKeywordAbility; startIndex: number }[] = [];
  const pattern = new RegExp(COST_KEYWORD_PATTERN.source, "g");

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const keyword = match[1] as CostKeyword;
    const followingText = match[2];

    const ability = parseCostKeyword(keyword, followingText);
    if (ability) {
      results.push({
        ability,
        startIndex: match.index,
      });
    }
  }

  return results;
}

/**
 * Check if a keyword is a cost keyword
 */
export function isCostKeyword(keyword: string): keyword is CostKeyword {
  return COST_KEYWORDS.includes(keyword as CostKeyword);
}
