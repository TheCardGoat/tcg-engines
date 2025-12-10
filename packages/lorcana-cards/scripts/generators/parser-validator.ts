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
function isSimpleDrawEffect(effect: any): boolean {
  // Direct draw effect
  if (effect.type === "draw") {
    return true;
  }

  // Wrapper effects - recurse into the inner effect
  if (effect.type === "conditional" && effect.then) {
    return isSimpleDrawEffect(effect.then);
  }

  const wrapperTypes = ["optional", "repeat", "for-each"];
  if (wrapperTypes.includes(effect.type) && effect.effect) {
    return isSimpleDrawEffect(effect.effect);
  }

  // Composite effects that are not simple wrappers (sequence, choice) are rejected
  return false;
}

/**
 * Check if all abilities on a card are parseable (keywords or simple draw effects)
 *
 * Strict validation:
 * - ALL abilities must parse with success: true
 * - NO warnings allowed
 * - ALL parsed abilities must be:
 *   - type: "keyword" (any keyword), OR
 *   - type: "action" with effect.type: "draw" (simple draw only, no composite effects), OR
 *   - type: "triggered" with effect.type: "draw" (simple draw only, no composite effects)
 *
 * This allows cards with:
 * - Keyword abilities (e.g., "Rush", "Challenger +2")
 * - Simple draw action abilities (e.g., "Draw a card", "Draw 2 cards")
 * - Simple draw triggered abilities (e.g., "When you play this, draw a card", "Whenever this character quests, draw a card")
 *
 * This REJECTS cards with:
 * - Other action effects (e.g., "Deal 3 damage", "Remove damage")
 * - Other triggered effects (e.g., "When you play this, deal 3 damage")
 * - Composite effects (e.g., "Draw a card and discard a card", "Draw 2 cards, then deal 1 damage")
 * - Choice effects (e.g., "Choose one: Draw a card or discard a card")
 * - Optional effects (e.g., "You may draw a card")
 * - Conditional effects (e.g., "If X, draw a card")
 *
 * @param card - The canonical card to check
 * @returns true if all abilities are successfully parsed keywords or simple draw actions/triggers
 */
export function isParseableCard(card: CanonicalCard): boolean {
  if (!card.rulesText) return false; // Vanilla cards handled separately

  const abilityTexts = card.rulesText.split("\n").filter((text) => text.trim());
  if (abilityTexts.length === 0) return false;

  return abilityTexts.every((text) => {
    const cleanText = stripReminderText(text);
    const result = parseAbilityText(cleanText);
    // Must succeed with no warnings
    if (!result.success || result.warnings?.length) return false;
    if (!result.ability) return false;

    const abilityType = result.ability.ability.type;

    // Allow keywords
    if (abilityType === "keyword") {
      return true;
    }

    // For action abilities, only allow simple draw effects
    if (abilityType === "action") {
      const effect = result.ability.ability.effect;
      if (!effect) return false;
      return isSimpleDrawEffect(effect);
    }

    // For triggered abilities, only allow simple draw effects
    if (abilityType === "triggered") {
      const effect = result.ability.ability.effect;
      if (!effect) return false;
      return isSimpleDrawEffect(effect);
    }

    // For activated abilities, only allow simple draw effects
    if (abilityType === "activated") {
      const effect = result.ability.ability.effect;
      if (!effect) return false;
      return isSimpleDrawEffect(effect);
    }

    // Reject all other ability types
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
