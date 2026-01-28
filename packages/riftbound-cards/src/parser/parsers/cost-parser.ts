/**
 * Cost Parser
 *
 * Parses cost strings into structured Cost objects.
 */

import type { Cost, Domain } from "@tcg/riftbound-types/abilities/cost-types";
import {
  ENERGY_PATTERN,
  EXHAUST_PATTERN,
  isValidDomain,
  POWER_PATTERN,
} from "../patterns/costs";

/**
 * Parse a cost string into a Cost object
 *
 * @param text - The cost string to parse (e.g., ":rb_energy_1::rb_rune_fury:")
 * @returns Cost object with extracted values
 *
 * @example
 * parseCost(":rb_energy_1::rb_rune_fury:")
 * // Returns: { energy: 1, power: ["fury"] }
 *
 * @example
 * parseCost(":rb_rune_body:")
 * // Returns: { power: ["body"] }
 *
 * @example
 * parseCost(":rb_exhaust:")
 * // Returns: { exhaust: true }
 */
export function parseCost(text: string): Cost {
  const cost: {
    energy?: number;
    power?: Domain[];
    exhaust?: boolean;
  } = {};

  // Parse energy cost
  const energyPattern = new RegExp(ENERGY_PATTERN.source, "g");
  let energyMatch: RegExpExecArray | null;
  while ((energyMatch = energyPattern.exec(text)) !== null) {
    const value = Number.parseInt(energyMatch[1], 10);
    // Sum multiple energy costs (though typically there's only one)
    cost.energy = (cost.energy ?? 0) + value;
  }

  // Parse power/rune costs
  const powerPattern = new RegExp(POWER_PATTERN.source, "g");
  let powerMatch: RegExpExecArray | null;
  while ((powerMatch = powerPattern.exec(text)) !== null) {
    const domain = powerMatch[1];
    if (isValidDomain(domain)) {
      if (!cost.power) {
        cost.power = [];
      }
      cost.power.push(domain);
    }
  }

  // Parse exhaust cost
  const exhaustPattern = new RegExp(EXHAUST_PATTERN.source, "g");
  if (exhaustPattern.test(text)) {
    cost.exhaust = true;
  }

  return cost;
}

/**
 * Check if a Cost object is empty (no cost)
 */
export function isEmptyCost(cost: Cost): boolean {
  return (
    cost.energy === undefined &&
    (cost.power === undefined || cost.power.length === 0) &&
    cost.exhaust !== true &&
    cost.kill === undefined &&
    cost.discard === undefined &&
    cost.recycle === undefined &&
    cost.spend === undefined &&
    cost.returnToHand === undefined
  );
}

/**
 * Extract the first cost string from text and parse it
 *
 * @param text - Text that may contain cost notation
 * @returns Cost object or null if no cost found
 */
export function extractAndParseCost(text: string): Cost | null {
  // Pattern to match a sequence of cost tokens
  const costSequencePattern =
    /(?::rb_(?:energy_\d+|rune_(?:fury|calm|mind|body|chaos|order|rainbow)|exhaust):)+/;
  const match = text.match(costSequencePattern);

  if (!match) {
    return null;
  }

  return parseCost(match[0]);
}

/**
 * Parse additional cost components like "Recycle N cards" or "Kill a friendly unit"
 *
 * @param text - Text that may contain additional cost descriptions
 * @returns Partial Cost object with additional cost components
 */
export function parseAdditionalCostText(text: string): Partial<Cost> {
  // Build the cost object with all properties at once
  const recycleMatch = text.match(/Recycle\s+(\d+)\s+cards?/i);
  const hasKillFriendlyUnit = /Kill\s+a\s+friendly\s+unit/i.test(text);

  return {
    ...(recycleMatch
      ? { recycle: Number.parseInt(recycleMatch[1], 10) }
      : undefined),
    ...(hasKillFriendlyUnit
      ? {
          kill: {
            type: "unit" as const,
            controller: "friendly" as const,
          },
        }
      : undefined),
  };
}

/**
 * Merge two Cost objects
 */
export function mergeCosts(base: Cost, additional: Partial<Cost>): Cost {
  return {
    energy:
      additional.energy !== undefined
        ? (base.energy ?? 0) + additional.energy
        : base.energy,
    power:
      additional.power !== undefined
        ? [...(base.power ?? []), ...additional.power]
        : base.power,
    exhaust: additional.exhaust ?? base.exhaust,
    recycle: additional.recycle ?? base.recycle,
    kill: additional.kill ?? base.kill,
    discard: additional.discard ?? base.discard,
    spend: additional.spend ?? base.spend,
    returnToHand: additional.returnToHand ?? base.returnToHand,
  };
}
