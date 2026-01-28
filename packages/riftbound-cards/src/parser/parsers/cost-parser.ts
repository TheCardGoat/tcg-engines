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
  const cost: Partial<Cost> = {};

  // Parse "Recycle N cards"
  const recycleMatch = text.match(/Recycle\s+(\d+)\s+cards?/i);
  if (recycleMatch) {
    cost.recycle = Number.parseInt(recycleMatch[1], 10);
  }

  // Parse "Kill a friendly unit" - simplified for now
  // Note: kill cost expects Target | "self", using Target with required fields
  if (/Kill\s+a\s+friendly\s+unit/i.test(text)) {
    cost.kill = {
      type: "unit",
      controller: "friendly",
    };
  }

  return cost;
}

/**
 * Merge two Cost objects
 */
export function mergeCosts(base: Cost, additional: Partial<Cost>): Cost {
  const merged: Cost = { ...base };

  if (additional.energy !== undefined) {
    merged.energy = (merged.energy ?? 0) + additional.energy;
  }

  if (additional.power !== undefined) {
    merged.power = [...(merged.power ?? []), ...additional.power];
  }

  if (additional.exhaust !== undefined) {
    merged.exhaust = additional.exhaust;
  }

  if (additional.recycle !== undefined) {
    merged.recycle = additional.recycle;
  }

  if (additional.kill !== undefined) {
    merged.kill = additional.kill;
  }

  if (additional.discard !== undefined) {
    merged.discard = additional.discard;
  }

  if (additional.spend !== undefined) {
    merged.spend = additional.spend;
  }

  if (additional.returnToHand !== undefined) {
    merged.returnToHand = additional.returnToHand;
  }

  return merged;
}
