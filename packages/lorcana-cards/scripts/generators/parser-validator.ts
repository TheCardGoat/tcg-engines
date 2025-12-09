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
 * A simple draw effect is one that ONLY draws cards, without any other actions.
 *
 * Accepted patterns:
 * - ✅ "Draw a card"
 * - ✅ "Draw 2 cards"
 * - ✅ "Each player draws a card"
 * - ✅ "Chosen player draws 2 cards"
 * - ✅ "When you play this, draw a card" (triggered with simple draw effect)
 * - ✅ "Whenever this character quests, draw a card" (triggered with simple draw effect)
 * - ✅ "You may draw a card" (optional)
 * - ✅ "If X, draw a card" (conditional)
 * - ✅ "Draw a card for each character" (for-each)
 * - ✅ "Draw a card. Repeat this 3 times" (repeat)
 * 
 * Rejected patterns:
 * - ❌ "Draw a card, then discard" (sequence)
 * - ❌ "Draw 2 cards, then deal 1 damage" (sequence)
 * - ❌ "Choose one: Draw a card or discard" (choice)

 *
 * @param effect - The effect to check
 * @returns true if the effect is a simple draw effect
 */
export function isSimpleDrawEffect(effect: {
  type: string;
  [key: string]: any;
}): boolean {
  // 1. Base case: "draw" type
  if (effect.type === "draw") {
    // Validate that it's a pure draw effect (no nested or extra properties)
    // Draw effects should only have: type, amount, target
    const allowedKeys = ["type", "amount", "target"];
    const hasOnlyDrawProperties = Object.keys(effect).every((key) => {
      // Ignore keys that might be added by system but aren't logic (none currently expected but good practice)
      // Actually strictly check for now to match previous logic
      return allowedKeys.includes(key);
    });
    return hasOnlyDrawProperties;
  }

  // 2. Recursive cases for wrapper effects
  // These are considered "simple" if their inner effect is a simple draw effect

  // Optional: { type: "optional", effect: Effect, chooser: ... }
  if (effect.type === "optional") {
    return isSimpleDrawEffect(effect.effect);
  }

  // Conditional: { type: "conditional", condition: ..., then: Effect, else?: Effect }
  if (effect.type === "conditional") {
    // "then" must be simple draw
    const thenIsSimple = isSimpleDrawEffect(effect.then);

    // "else" must be either missing or simple draw
    // (e.g. "If X draw 1, else draw 2" is arguably simple, but "If X draw 1 else discard" is not)
    // For now, if else exists, we require it to be simple too.
    const elseIsSimple = !effect.else || isSimpleDrawEffect(effect.else);

    return thenIsSimple && elseIsSimple;
  }

  // For-each: { type: "for-each", counter: ..., effect: Effect }
  if (effect.type === "for-each") {
    return isSimpleDrawEffect(effect.effect);
  }

  // Repeat: { type: "repeat", times: ..., effect: Effect }
  if (effect.type === "repeat") {
    return isSimpleDrawEffect(effect.effect);
  }

  // 3. Rejected cases
  // - sequence (unless we want to support "draw then draw", but "draw then discard" is definitely NO)
  // - choice (explicitly rejected in requirements)
  // - others
  return false;
}

/**
 * Check if a sequence effect contains ONLY simple draw effects
 *
 * Note: Even if a sequence contains only draws (e.g. "Draw a card, then draw a card"),
 * it is technically not a "simple draw effect" by our strict definition,
 * but this helper exists if we ever want to relax that rule.
 */
export function isSequenceWithOnlyDraw(effect: {
  type: string;
  steps?: unknown[];
}): boolean {
  if (effect.type !== "sequence") {
    return false;
  }

  if (!(effect.steps && Array.isArray(effect.steps))) {
    return false;
  }

  return effect.steps.every(
    (step) =>
      typeof step === "object" &&
      step !== null &&
      "type" in step &&
      // @ts-ignore - we know it has type based on check above
      isSimpleDrawEffect(step),
  );
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
 * ✅ ALLOWED patterns (simple draw effects):
 * - "Draw a card" (standalone action)
 * - "Draw 2 cards" (standalone action)
 * - "Draw {d} cards" (with placeholder)
 * - "Each player draws a card" (action with target)
 * - "Each player draws {d} cards" (action with target + placeholder)
 * - "Chosen player draws {d} cards" (action with target)
 * - "Each opponent draws a card" (action with target)
 * - "I SUMMON THEE {E} − Draw a card" (action with cost)
 * - "Speak {E}, {d} {I} - Draw a card" (action with cost)
 * - "THE BOOK KNOWS EVERYTHING , {d} , Banish this item — Draw {d} cards" (action with cost/banish cost)
 * - "When you play this, draw a card" (triggered)
 * - "When you play this item, draw a card" (triggered)
 * - "Whenever this character quests, draw a card" (triggered)
 * - "Whenever this character is challenged, draw a card" (triggered)
 * - "When this character is banished, draw a card" (triggered)
 * - "When this character is banished in a challenge, draw a card" (triggered)
 * - "At the start of your turn, draw a card" (triggered)
 * - "Whenever you play a card, draw a card" (triggered)
 * - "Whenever you play a Floodborn character, draw a card" (triggered)
 * - "ORIGIN STORY When you play a Floodborn character on this card, draw a card" (named triggered)
 * - "FRESH INK When you play this item, draw a card" (named triggered)
 * - "PREFLIGHT CHECK When you play this item, draw a card" (named triggered)
 * - "WHAT COMES NEXT? When you play this character, draw a card" (named triggered)
 * - "UPPER HAND Whenever this character is challenged, draw a card" (named triggered)
 * - "UNEARTHED When you play this character, each opponent draws a card" (named triggered, opponent target)
 * - "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card" (named triggered)
 * - "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw {d} cards" (conditional trigger with simple draw effect)
 * - "You may draw a card" (optional)
 * - "If you have no cards in your hand, draw a card" (conditional effect, allowed if inner is simple draw)
 * - "Draw a card for each character you have" (for-each)
 * - "Draw a card. Repeat this 3 times" (repeat)
 *
 * ❌ REJECTED patterns (NOT simple draw effects):
 * - "Draw a card, then discard" (sequence with discard)
 * - "Draw 2 cards, then deal 1 damage" (sequence with damage)
 * - "Draw a card and gain 1 lore" (sequence with "and")
 * - "Gain {d} lore. Draw a card" (sequence with period)
 * - "Banish chosen item. Draw a card" (sequence with banish)
 * - "Deal {d} damage to chosen character. Draw a card" (sequence with damage)
 * - "Choose one: Draw a card or discard" (choice)
 * - "Each player may draw a card" (Allowed now as optional)
 *
 * NOTE: Conditional TRIGGERS with simple draw effects are ALLOWED (e.g., "When X happens if Y, draw a card")
 *       but conditional EFFECTS are NOT (e.g., "If Y, draw a card" as a standalone effect)
 *
 * @param card - The canonical card to check
 * @returns true if all abilities are successfully parsed keywords or simple draw actions/triggers
 */
export function isParseableCard(card: CanonicalCard): boolean {
  if (!card.rulesText) {
    return false; // Vanilla cards handled separately
  }
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
      if (!effect) {
        return false;
      }
      return isSimpleDrawEffect(effect);
    }

    // Reject all other ability types
    return false;
  });
}

/**
 * Check if a card has at least one simple draw ability
 *
 * This is used for logging/statistics purposes to track how many cards
 * contain simple draw effects (not keywords).
 *
 * @param card - The canonical card to check
 * @returns true if the card has at least one simple draw ability
 */
export function hasSimpleDrawAbility(card: CanonicalCard): boolean {
  if (!card.rulesText) return false;
  if (card.vanilla) return false;

  const abilityTexts = card.rulesText.split("\n").filter((text) => text.trim());
  if (abilityTexts.length === 0) return false;

  return abilityTexts.some((text) => {
    const cleanText = stripReminderText(text);
    const result = parseAbilityText(cleanText);
    if (!(result.success && result.ability)) return false;

    const abilityType = result.ability.ability.type;

    // Check if it's an action, triggered or activated ability with simple draw effect
    if (
      abilityType === "action" ||
      abilityType === "triggered" ||
      abilityType === "activated"
    ) {
      const effect = result.ability.ability.effect;
      if (!effect) return false;
      return isSimpleDrawEffect(effect);
    }

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
