/**
 * Parser Validation Helpers
 *
 * Functions to validate and parse card abilities using the ability parser.
 * Used by the card generation script to determine which cards can be generated
 * with structured ability definitions.
 */

import { parseAbilityText } from "../../src/parser";
import type { AbilityWithText } from "../../src/parser/types";
import type { CanonicalCard } from "../types";

/**
 * Strip reminder text (parenthetical content) from ability text.
 * Keywords often include reminder text like:
 * "Shift 5 (You may pay 5 {I} to play this...)"
 * We want to parse just "Shift 5"
 */
function stripReminderText(text: string): string {
  // Remove parenthetical content at the end of the text
  // Match: optional space + opening paren + any content + closing paren at end
  return text.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

/**
 * Check if all abilities on a card are keyword-only and parse successfully
 *
 * Strict validation:
 * - ALL abilities must parse with success: true
 * - NO warnings allowed
 * - ALL parsed abilities must be type: "keyword"
 *
 * @param card - The canonical card to check
 * @returns true if all abilities are successfully parsed keywords
 */
export function isKeywordOnlyCard(card: CanonicalCard): boolean {
  if (!card.rulesText) return false; // Vanilla cards handled separately

  const abilityTexts = card.rulesText.split("\n").filter((text) => text.trim());
  if (abilityTexts.length === 0) return false;

  return abilityTexts.every((text) => {
    const cleanText = stripReminderText(text);
    const result = parseAbilityText(cleanText);
    // Must succeed with no warnings
    if (!result.success || result.warnings?.length) return false;
    // Must be a keyword ability
    return result.ability?.ability.type === "keyword";
  });
}

/**
 * Check if an effect is a simple draw effect (not composite)
 *
 * @param effect - The effect to check
 * @returns true if the effect is a simple draw effect
 */
function isSimpleDrawEffect(effect: { type: string }): boolean {
  // Must be a simple draw effect (not composite)
  // Composite effects have types: "sequence", "choice", "optional", "conditional", "for-each", "repeat"
  const compositeTypes = [
    "sequence",
    "choice",
    "optional",
    "conditional",
    "for-each",
    "repeat",
  ];
  if (compositeTypes.includes(effect.type)) {
    return false;
  }

  // Must be exactly "draw" type
  return effect.type === "draw";
}

/**
 * Check if all abilities on a card are parseable
 *
 * Logic:
 * - For Set 1 and Set 2: Relaxed validation (allow all successfully parsed abilities)
 * - For other sets: Strict validation (keywords or simple draw only)
 *
 * @param card - The canonical card to check
 * @returns true if all abilities are successfully parsed and pass validation
 */
export function isParseableCard(card: CanonicalCard): boolean {
  if (!card.rulesText) return false; // Vanilla cards handled separately

  const abilityTexts = card.rulesText.split("\n").filter((text) => text.trim());
  if (abilityTexts.length === 0) return false;

  // Check if card is from Set 1
  const isTargetSet = card.printings.some((p) => p.set === "set1");

  return abilityTexts.every((text) => {
    const cleanText = stripReminderText(text);
    const result = parseAbilityText(cleanText);

    // Must parse successfully
    if (!(result.success && result.ability)) return false;

    // For non-target sets, we disallow warnings
    if (!isTargetSet && result.warnings?.length) return false;

    const abilityType = result.ability.ability.type;

    // RELAXED LOGIC (Set 1 & 2)
    if (isTargetSet) {
      const validTypes = [
        "keyword",
        "activated",
        "static",
        "triggered",
        "action",
      ];
      return validTypes.includes(abilityType);
    }

    // STRICT LOGIC (Other Sets)
    // Allow keywords
    if (abilityType === "keyword") {
      return true;
    }

    // For action/triggered abilities, only allow simple draw effects
    if (abilityType === "action" || abilityType === "triggered") {
      const effect = result.ability.ability.effect;
      if (!effect) return false;
      return isSimpleDrawEffect(effect);
    }

    // Reject all other ability types for strict sets
    return false;
  });
}

/**
 * Parse abilities for a keyword-only card
 *
 * Returns the parsed abilities if ALL abilities are:
 * - Successfully parsed (success: true)
 * - Have no warnings
 * - Are keyword abilities
 *
 * @param card - The canonical card to parse
 * @returns Array of parsed abilities, or null if any ability fails validation
 */
export function parseKeywordAbilities(
  card: CanonicalCard,
): AbilityWithText[] | null {
  if (!card.rulesText) return [];

  const abilityTexts = card.rulesText.split("\n").filter((text) => text.trim());
  const parsed: AbilityWithText[] = [];

  for (const text of abilityTexts) {
    const cleanText = stripReminderText(text);
    const result = parseAbilityText(cleanText);
    // Strict: success, no warnings, must be keyword
    if (!result.success || result.warnings?.length || !result.ability)
      return null;
    if (result.ability.ability.type !== "keyword") return null;
    parsed.push(result.ability);
  }

  return parsed;
}
