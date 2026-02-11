/**
 * Activated Ability Parser
 *
 * Parses activated abilities with cost and effect.
 * Format: [NAME] COST - EFFECT
 * Examples:
 * - "{E} - Draw a card"
 * - "MAGIC HAIR {E} - Remove up to 3 damage from chosen character"
 * - "{E}, 2 {I} - Deal 3 damage to chosen character"
 */

import type { ActivatedAbility as ActivatedAbilityType } from "@tcg/lorcana";
import { parseAtomicEffect, parseCompositeEffect } from "../effects";
import { logger } from "../logging";

interface Cost {
  exert?: boolean;
  ink?: number;
  banishSelf?: boolean;
  banishItem?: boolean;
  banishCharacter?: boolean;
  placeholders?: Record<string, number>;
}

interface ActivatedAbility {
  type: "activated";
  name?: string;
  cost: Cost;
  effect: unknown;
}

interface ParseResult {
  success: boolean;
  ability?: { name?: string; text?: string; ability: ActivatedAbility };
  error?: string;
}

/**
 * Parse activated ability from text.
 */
export function parseActivatedAbility(text: string): ParseResult {
  logger.info("Parsing activated ability", { text });

  // Check for cost separator: - (hyphen), − (en dash), – (em dash), or :
  // The separator must have non-whitespace on both sides
  const separatorPattern = /\s*[-−–:]\s*/;
  const separatorMatch = text.match(separatorPattern);

  if (!separatorMatch) {
    return {
      error: "Could not find cost separator",
      success: false,
    };
  }

  const separatorIndex = text.indexOf(separatorMatch[0]);
  const costText = text.slice(0, separatorIndex).trim();
  const effectText = text
    .slice(separatorIndex + separatorMatch[0].length)
    .trim();

  // Parse the cost
  const cost = parseCost(costText);
  if (!cost) {
    return {
      error: "Could not parse cost",
      success: false,
    };
  }

  // Check for named ability (all caps prefix before cost)
  const nameMatch = costText.match(/^([A-Z][A-Z\s]+?)\s+(?={[EI])/);
  const name = nameMatch ? nameMatch[1].trim() : undefined;

  // Parse the effect
  const effect =
    parseCompositeEffect(effectText) || parseAtomicEffect(effectText);
  if (!effect) {
    return {
      error: "Could not parse effect",
      success: false,
    };
  }

  const activatedAbility: ActivatedAbility = {
    cost,
    effect,
    name,
    type: "activated",
  };

  logger.info("Successfully parsed activated ability", {
    cost,
    effect,
    name,
  });

  return {
    ability: { ability: activatedAbility, name, text },
    success: true,
  };
}

/**
 * Parse cost from cost text.
 * Examples:
 * - "{E}" -> { exert: true }
 * - "2 {I}" -> { ink: 2 }
 * - "{E}, 2 {I}" -> { exert: true, ink: 2 }
 * - "{E}, Banish this item" -> { exert: true, banishThisItem: true }
 * - "{d} {I}" -> { ink: 0, placeholders: { "{d}": 0 } }
 */
function parseCost(costText: string): Cost | null {
  logger.debug("Parsing cost", { costText });

  const cost: Cost = {};

  // Extract and remove name if present (all caps before first cost symbol)
  const cleanCostText = costText.replace(/^[A-Z][A-Z\s]+?\s+/, "");

  // Parse {E} (exert)
  if (/{E}/.test(cleanCostText)) {
    cost.exert = true;
  }

  // Parse {I} (ink)
  const inkMatch = cleanCostText.match(/(\d+|\{d\})\s*{I}/);
  if (inkMatch) {
    const inkValue = inkMatch[1];
    if (inkValue === "{d}") {
      cost.ink = -1; // Use -1 as sentinel value for placeholder
      cost.placeholders = cost.placeholders || {};
      cost.placeholders["{d}"] = -1;
    } else {
      cost.ink = Number.parseInt(inkValue, 10);
    }
  }

  // Parse banish costs
  // "Banish this item" and "Banish this character" both mean banish self
  // (the self depends on the card type the ability is on)
  if (/Banish this (item|character)/i.test(cleanCostText)) {
    cost.banishSelf = true;
  } else if (/Banish this/i.test(cleanCostText)) {
    cost.banishSelf = true;
  }

  // If we couldn't parse any cost components, fail
  if (
    !cost.exert &&
    cost.ink === undefined &&
    !cost.banishSelf &&
    !cost.banishItem &&
    !cost.banishCharacter
  ) {
    return null;
  }

  logger.debug("Successfully parsed cost", { cost });
  return cost;
}
