/**
 * Activated Ability Parser
 *
 * Parses activated abilities from text.
 * Format: "{Cost} - {Effect}" or "NAME {Cost} - {Effect}"
 * Examples:
 * - "{E} - Draw a card"
 * - "{E}, 2 {I} - Deal 3 damage to chosen character"
 * - "{E}, {d} {I} - Deal {d} damage to chosen character"
 * - "Banish this item - Gain 3 lore"
 * - "MAGIC HAIR {E} - Remove up to 3 damage from chosen character"
 * - "SKIRMISH {E} − Deal {d} damage to chosen character"
 */

import type { ActivatedAbility } from "../../cards/abilities/types/ability-types";
import type { AbilityCost } from "../../cards/abilities/types/cost-types";
import { extractNamedAbilityPrefix } from "../preprocessor";
import type { ParseResult } from "../types";
import { parseEffect } from "./effect-parser";

/**
 * Parse an activated ability from text
 *
 * @param text - Normalized ability text
 * @returns Parse result with activated ability
 */
export function parseActivatedAbility(text: string): ParseResult {
  // Extract named ability prefix if present
  const extracted = extractNamedAbilityPrefix(text);
  const name = extracted?.name;
  const remainingText = extracted?.remainingText || text;

  // Split cost from effect by cost separator (-, −, –, or :)
  const splitMatch = remainingText.match(/^(.+?)\s*[-−–:]\s*(.+)$/);
  if (!splitMatch) {
    return {
      success: false,
      error: "Could not find cost separator (-, −, –, or :)",
    };
  }

  const costText = splitMatch[1].trim();
  const effectText = splitMatch[2].trim();

  // Parse cost
  const cost = parseCost(costText);
  if (!cost) {
    return {
      success: false,
      error: `Could not parse cost: "${costText}"`,
    };
  }

  // Parse effect
  const effect = parseEffect(effectText);
  if (!effect) {
    return {
      success: false,
      error: `Could not parse effect: "${effectText}"`,
    };
  }

  // Build activated ability
  const ability: ActivatedAbility = {
    type: "activated",
    cost,
    effect,
  };

  if (name) {
    ability.name = name;
  }

  return {
    success: true,
    ability: {
      ability,
      text,
      name,
    },
  };
}

/**
 * Parse cost from text
 *
 * Handles:
 * - {E} - exert cost
 * - N {I} - ink cost (N can be numeric or {d} placeholder)
 * - {E}, N {I} - combined exert and ink costs
 * - {E}, Banish this item/character - combined exert and banish costs
 * - Banish this item/character - banish self cost
 * - Choose and discard N cards - discard cost
 */
function parseCost(text: string): AbilityCost | undefined {
  const cost: AbilityCost = {};

  // Check for exert cost
  if (text.includes("{E}")) {
    cost.exert = true;
  }

  // Check for ink cost - supports both numeric and {d} placeholder
  const inkMatch = text.match(/(\{d\}|\d+)\s*\{I\}/);
  if (inkMatch) {
    const inkValue = inkMatch[1];
    // Convert {d} to -1 as placeholder value
    cost.ink = inkValue === "{d}" ? -1 : Number.parseInt(inkValue, 10);
  }

  // Check for banish self cost
  if (text.match(/Banish this (?:item|character)/i)) {
    cost.banishSelf = true;
  }

  // Check for discard cost
  const discardMatch = text.match(
    /Choose and discard (?:a|(\{d\}|\d+)) cards?/i,
  );
  if (discardMatch) {
    const discardValue = discardMatch[1];
    // Handle "a" (implicitly 1 card), {d} placeholder, or numeric
    const amount = discardValue
      ? discardValue === "{d}"
        ? -1
        : Number.parseInt(discardValue, 10)
      : 1;
    cost.discardCards = amount;
    cost.discardChosen = true;
  }

  // Validate we found at least one cost component
  if (Object.keys(cost).length === 0) {
    return undefined;
  }

  return cost;
}
