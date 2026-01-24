/**
 * Parser Validation Helpers
 *
 * Functions to validate and parse card abilities using the ability parser.
 * Used by the card generation script to determine which cards can be generated
 * with structured ability definitions.
 */

import { parseAbilityText, parseAbilityTextMulti } from "../../src/parser";
import { tooComplexText } from "../../src/parser/v2/manual-overrides";
import { normalizeToPattern } from "../../src/parser/v2/numeric-extractor";
import { normalizeText } from "../../src/parser/v2/preprocessor";
import type { AbilityWithText } from "../../src/parser/v2/types";
import type { CanonicalCard } from "../types";

/**
 * Text patterns that indicate a card is NOT a simple draw effect.
 * These are checked against the card's rulesText before parsing.
 *
 * This allows us to quickly skip complex cards that the parser might
 * technically parse but are too complex for our simple draw effect generator.
 */
const COMPLEX_TEXT_PATTERNS = [
  // Choice effects (Choose one: X or Y)
  /choose one:/i,

  // Draw + discard sequences
  /draw.*then.*discard/i,
  /draw.*choose and discard/i,
  /draw.*then choose and discard/i,

  // Draw + other action sequences (put, gain, deal, etc.)
  /draw.*then.*put/i,
  /draw.*and.*gain/i,
  /draw.*and.*deal/i,

  // Discard + draw (in any order)
  /discard.*to draw/i,
  /discard.*draw/i,

  // Effects that have "otherwise" or "instead"
  /otherwise/i,
  /instead/i,

  // Effects with costs that aren't just simple "may"
  /pay \d+ \{I\} to draw/i,
  /banish.*to draw/i,

  // Complex conditions - comparing values
  /has more cards/i,
  /have more cards/i,
  /unless that/i,

  // Effects that do more than draw
  /draw.*put.*bottom/i,
  /draw.*shuffle/i,
  /draw.*deal.*damage/i,

  // Multiple triggers in one ability
  /and when.*leaves play/i,
  /and whenever/i,

  // Banish effects that aren't simple (e.g., "banish item, if you do, draw")
  /banish.*if you do/i,
  /may banish.*draw/i,
  /may banish chosen/i,

  // Complex conditions with multiple named characters
  /if you have characters named/i,
  /characters named.*and/i,

  // Triggers that aren't standard events (remove damage, challenges damaged)
  /remove.*damage/i,
  /challenges.*damaged/i,
  /challenges a damaged/i,

  // Location-specific triggers
  /while here/i,
  /while at/i,

  // Effect targets specific card types with additional conditions
  /with \d+ \{S\} or more/i,
  /with Bodyguard/i,

  // Return to hand/deck as cost for draw
  /return.*to your hand.*draw/i,
  /return.*to your deck.*draw/i,

  // Shuffle as cost for draw
  /shuffle.*into your deck.*draw/i,
  /shuffle this card.*draw/i,

  // Deal damage as cost for draw
  /deal.*damage.*to draw/i,
  /deal \d+ damage.*draw/i,
  /may deal.*damage.*draw/i,

  // Shift-specific conditions (complex trigger conditions)
  /if you used Shift/i,

  // For-each draw patterns (dynamic amounts - complex for now)
  /draw a card for each/i,
  /draw \d+ cards? for each/i,
];

/**
 * Check if a card's rules text contains any complex patterns that
 * indicate it's NOT a simple draw effect.
 *
 * @param rulesText - The card's rules text
 * @returns true if the text contains complex patterns
 */
function hasComplexTextPatterns(rulesText: string): boolean {
  return COMPLEX_TEXT_PATTERNS.some((pattern) => pattern.test(rulesText));
}

/**
 * Strip reminder text (parenthetical content) from ability text.
 * Keywords often include reminder text like:
 * "Shift 5 (You may pay 5 {I} to play this...)"
 * We want to parse just "Shift 5"
 */
function stripReminderText(text: string): string {
  // Remove parenthetical content at the beginning or end of the text
  return text
    .replace(/^\s*\([^)]*\)\s*/, "") // Leading
    .replace(/\s*\([^)]*\)\s*$/, "") // Trailing
    .trim();
}

/**
 * Strip all parenthetical content from text (for manual override matching)
 * This removes all reminder text, not just at the end
 */
function stripAllParentheses(text: string): string {
  return text
    .replace(/\([^)]*\)/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Normalize punctuation differences for manual override matching
 * Handles common variations in punctuation that don't affect meaning
 */
function normalizePunctuation(text: string): string {
  return (
    text
      // NOTE: Don't normalize em dashes to hyphens - manual override keys use em dashes intentionally
      // Normalize various dash types to hyphen (but preserve em dashes)
      // .replace(/[–−]/g, "-") // Only normalize en dashes and figure dashes, not em dashes
      // Normalize quote marks
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Normalize ellipsis
      .replace(/\.\.\./g, "...")
      // Normalize multiple punctuation
      .replace(/,{2,}/g, ",")
      .replace(/\.{2,}/g, ".")
      // Ensure proper spacing around punctuation (but preserve em dash spacing)
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s*\.\s*/g, ". ")
      .replace(/\s*-\s*/g, " - ") // Only normalize regular hyphens
      .replace(/\s*:\s*/g, ": ")
      .replace(/\s*\?\s*/g, "? ")
      .replace(/\s*!\s*/g, "! ")
  );
}

/**
 * Normalize sequencing words and phrases for manual override matching
 * Handles common variations in how sequences are expressed
 */
function normalizeSequencing(text: string): string {
  return (
    text
      // Conservative normalization - only target very specific known issues

      // Don't normalize comma-then patterns as they may be intentional
      // .replace(/\s*,\s*then\s+/g, " then ") // REMOVED - too aggressive

      // Only normalize period-then patterns if they're clearly redundant
      .replace(/\s*\.\s*then\s+/g, " then ")

      // Only normalize excessive "then" spacing
      .replace(/\s+then\s+/g, " then ")
  );
}

/**
 * Normalize common phrase variations for manual override matching
 * Handles synonymous expressions that mean the same thing
 */
function normalizePhrases(text: string): string {
  return (
    text
      // Normalize card text TO match manual override key patterns
      // This converts variations in card text to the standardized manual override format

      // Normalize "at random" variations - remove this phrase (not in manual override keys)
      .replace(/\s+at random\./gi, ".")
      .replace(/\s+at random/gi, "")

      // Convert card text pattern TO manual override key pattern
      // Convert "hand, then that player discards a card" to "hand. That player chooses and discards a card"
      .replace(
        /hand,\s*then that player discards a card\./gi,
        "hand. That player chooses and discards a card.",
      )
      .replace(
        /hand,\s*then that player discards/gi,
        "hand. That player chooses and discards",
      )

      // Convert variations of the above pattern
      .replace(
        /hand\.\s*then that player discards a card\./gi,
        "hand. That player chooses and discards a card.",
      )
      .replace(
        /hand\.\s*then that player discards/gi,
        "hand. That player chooses and discards",
      )

      // Normalize extra spaces around specific phrases
      .replace(/\s+/g, " ")
  ); // Only normalize excessive whitespace, not structure
}

/**
 * Comprehensive normalization for manual override matching
 * Applies all normalization steps in the correct order
 */
export function normalizeForMatching(text: string): string {
  // Step 1: Strip all parentheses (reminder text)
  let normalized = stripAllParentheses(text);

  // Step 2: Normalize punctuation
  normalized = normalizePunctuation(normalized);

  // Step 3: Normalize sequencing words and phrases
  normalized = normalizeSequencing(normalized);

  // Step 4: Normalize common phrase variations
  normalized = normalizePhrases(normalized);

  // Step 5: Normalize whitespace
  normalized = normalizeText(normalized);

  // Step 6: Convert numbers to {d} placeholders
  return normalizeToPattern(normalized);
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
    if (!cleanText) return true;
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
  if (!card.rulesText) {
    return false; // Vanilla cards handled separately
  }

  // First, check if the full text matches a manual override
  // Manual overrides are keyed by normalized text with {d} placeholders, so we need to:
  // Use comprehensive normalization to handle formatting differences
  const fullText = card.rulesText.replace(/\n/g, " ");
  const patternFullText = normalizeForMatching(fullText);
  if (tooComplexText(patternFullText)) {
    // Card has a manual override - consider it parseable
    return true;
  }

  // Also check individual ability lines (for single-ability manual overrides)
  // Some cards have multiple abilities, and manual overrides might only match one
  const abilityLines = card.rulesText.split("\n").filter((line) => line.trim());
  for (const line of abilityLines) {
    // Use comprehensive normalization for each line
    const patternLine = normalizeForMatching(line.trim());
    if (tooComplexText(patternLine)) {
      // At least one ability has a manual override - consider it parseable
      return true;
    }
  }

  // Quick check: reject cards with complex text patterns
  if (hasComplexTextPatterns(card.rulesText)) {
    return false;
  }

  const abilityTexts = card.rulesText.split("\n").filter((text) => text.trim());
  if (abilityTexts.length === 0) return false;

  // Check if card is from Set 1
  const isTargetSet = card.printings.some((p) => p.set === "set1");

  return abilityTexts.every((text) => {
    const cleanText = stripReminderText(text);
    if (!cleanText) return true;

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

    // For action/triggered/activated/static abilities, only allow simple draw effects
    // Static abilities include effects like "Each player draws a card"
    if (
      abilityType === "action" ||
      abilityType === "triggered" ||
      abilityType === "activated" ||
      abilityType === "static"
    ) {
      const effect = result.ability.ability.effect;
      if (!effect) return false;
      return isSimpleDrawEffect(effect);
    }

    // Reject all other ability types for strict sets
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

  // Quick check: reject cards with complex text patterns
  if (hasComplexTextPatterns(card.rulesText)) {
    return false;
  }

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
 * Check if a card uses a manual override entry
 *
 * Manual override keys can match:
 * - Full card text (multiple abilities combined)
 * - Individual ability lines
 *
 * @param card - The canonical card to check
 * @returns true if the card's rulesText matches a manual override entry
 */
export function hasManualOverride(card: CanonicalCard): boolean {
  if (!card.rulesText) return false;

  // First, check the full text (for multi-ability manual overrides)
  // Use comprehensive normalization to handle formatting differences
  const fullText = card.rulesText.replace(/\n/g, " ");
  const patternFullText = normalizeForMatching(fullText);
  if (tooComplexText(patternFullText)) {
    return true;
  }

  // Also check individual ability lines (for single-ability manual overrides)
  // Some cards have multiple abilities, and manual overrides might only match one
  const abilityLines = card.rulesText.split("\n").filter((line) => line.trim());
  for (const line of abilityLines) {
    // Use comprehensive normalization for each line
    const patternLine = normalizeForMatching(line.trim());
    if (tooComplexText(patternLine)) {
      return true;
    }
  }

  return false;
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
    if (!cleanText) continue;
    const result = parseAbilityText(cleanText);
    // Strict: success, no warnings, must be keyword
    if (!result.success || result.warnings?.length || !result.ability)
      return null;
    if (result.ability.ability.type !== "keyword") return null;
    parsed.push(result.ability);
  }

  return parsed;
}
