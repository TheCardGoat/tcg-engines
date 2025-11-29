/**
 * Ability Type Classifier
 *
 * Determines the type of ability from text patterns using priority-ordered rules:
 * 1. Keyword (exact match) - highest priority
 * 2. Triggered (starts with trigger word)
 * 3. Activated (has cost separator)
 * 4. Static (continuous modifications/restrictions)
 * 5. Action (standalone effect - no triggers/costs/conditions)
 * 6. Default to Static (fallback)
 *
 * Note: Named ability prefixes (ALL CAPS) are stripped before classification
 * to ensure accurate pattern matching.
 */

import { hasActivatedAbilityCost } from "./patterns/costs";
import { isKeywordAbilityText } from "./patterns/keywords";
import { isTriggeredAbilityText } from "./patterns/triggers";
import { extractNamedAbilityPrefix } from "./preprocessor";
import type { ClassificationResult } from "./types";

/**
 * Check if text is a standalone action effect
 *
 * Action effects:
 * - Start with an effect verb (Draw, Deal, Banish, Gain, etc.)
 * - Have NO trigger words (When/Whenever/At)
 * - Have NO cost separators ({E} -, Banish this -)
 * - Have NO condition words at the start (While, Your, If)
 * - Do NOT target selection for continuous effects (Chosen X gains/gets)
 *
 * @example "Draw 2 cards"
 * @example "Deal 3 damage to chosen character"
 * @example "Banish all items"
 * @example "Each opponent loses 2 lore"
 */
function isActionEffect(text: string): boolean {
  // Must start with common effect verbs
  const actionVerbs = [
    /^Draw\s+/i,
    /^Deal\s+/i,
    /^Banish\s+/i,
    /^Gain\s+/i,
    /^Ready\s+/i,
    /^Exert\s+/i,
    /^Return\s+/i,
    /^Remove\s+/i,
    /^Each\s+(?:player|opponent)/i,
    /^Put\s+/i,
    /^Play\s+/i,
    /^Reveal\s+/i,
    /^Search\s+/i,
    /^Shuffle\s+/i,
    /^Move\s+/i,
    /^Look\s+/i,
    /^Name\s+/i,
  ];

  const startsWithActionVerb = actionVerbs.some((pattern) =>
    pattern.test(text),
  );
  if (!startsWithActionVerb) {
    return false;
  }

  // Must NOT have trigger words
  if (isTriggeredAbilityText(text)) {
    return false;
  }

  // Must NOT have cost separators
  if (hasActivatedAbilityCost(text)) {
    return false;
  }

  // Must NOT start with static ability patterns
  const staticStarters = [
    /^While\s+/i,
    /^Your\s+/i,
    /^Opposing\s+/i,
    /^Characters\s+/i,
    /^Items\s+/i,
    /^Locations\s+/i,
    /^All\s+characters/i,
    /^All\s+items/i,
    /^All\s+locations/i,
    /^This\s+character\s+(?:gets|gains|can'?t|cannot)/i,
    /^If\s+/i,
  ];

  const hasStaticStarter = staticStarters.some((pattern) => pattern.test(text));
  if (hasStaticStarter) {
    return false;
  }

  return true;
}

/**
 * Classify an ability text into its type
 *
 * Uses pattern matching to determine whether the text represents:
 * - keyword: Simple or complex keywords (Rush, Challenger +3, Shift 5)
 * - triggered: Abilities with trigger words (When/Whenever/At)
 * - activated: Abilities with costs ({E} -, Banish this -)
 * - static: Continuous effects (Chosen character gains, Your characters gain, etc.)
 * - action: Standalone effects (Draw 2 cards, Banish all items)
 *
 * @param text - Normalized ability text
 * @returns Classification result with type and confidence
 */
export function classifyAbility(text: string): ClassificationResult {
  // Strip named ability prefix if present (e.g., "DARK KNOWLEDGE Whenever...")
  // This ensures we classify based on the actual ability text, not the name
  const extracted = extractNamedAbilityPrefix(text);
  const textToClassify = extracted?.remainingText || text;

  // Priority 1: Check for keyword abilities (exact match)
  if (isKeywordAbilityText(textToClassify)) {
    return {
      type: "keyword",
      confidence: 1.0,
      reason: "Matched keyword pattern",
    };
  }

  // Priority 2: Check for triggered abilities (trigger word prefix)
  if (isTriggeredAbilityText(textToClassify)) {
    return {
      type: "triggered",
      confidence: 0.95,
      reason: "Starts with trigger word (When/Whenever/At/The first time)",
    };
  }

  // Priority 3: Check for activated abilities (cost separator)
  if (hasActivatedAbilityCost(textToClassify)) {
    return {
      type: "activated",
      confidence: 0.9,
      reason: "Contains cost separator pattern",
    };
  }

  // Priority 4: Check for replacement abilities (would/instead pattern)
  if (textToClassify.includes("would") && textToClassify.includes("instead")) {
    return {
      type: "replacement",
      confidence: 0.85,
      reason: "Contains replacement pattern (would...instead)",
    };
  }

  // Priority 5: Check for common static ability patterns (before action)
  // This is important because some static abilities start with words that could
  // be confused with action verbs (e.g., "Chosen character gains Rush")
  if (isLikelyStaticAbility(textToClassify)) {
    return {
      type: "static",
      confidence: 0.85,
      reason: "Matches common static ability patterns",
    };
  }

  // Priority 6: Check for action effects (standalone effects)
  if (isActionEffect(textToClassify)) {
    return {
      type: "action",
      confidence: 0.85,
      reason: "Standalone effect starting with action verb",
    };
  }

  // Default: Static ability (continuous effect)
  // Lower confidence because we're not pattern-matching
  return {
    type: "static",
    confidence: 0.7,
    reason: "Default to static ability (no other patterns matched)",
  };
}

/**
 * Check if text is likely a static ability based on common patterns
 *
 * Static abilities typically:
 * - Start with "Your" (affecting other cards)
 * - Start with "Opposing" (affecting opponent's cards)
 * - Start with "Characters" or "Items" (affecting card types)
 * - Contain "can't" (restrictions)
 * - Contain "gain" or "get" without trigger words (continuous modifications)
 * - Start with "While" without being followed by a trigger
 * - Contain "Chosen X gains/gets" (target selection for continuous effects)
 */
function isLikelyStaticAbility(text: string): boolean {
  // Check for common static ability starters
  if (
    text.match(/^Your\s+/i) ||
    text.match(/^Opposing\s+/i) ||
    text.match(/^Characters\s+/i) ||
    text.match(/^Items\s+/i) ||
    text.match(/^Locations\s+/i) ||
    text.match(/^All\s+/i)
  ) {
    return true;
  }

  // Check for restriction patterns
  if (
    text.match(/\bcan'?t\s+(?:be\s+)?(?:challenged?|quest|move|sing)/i) ||
    text.match(/\bcannot\s+/i)
  ) {
    return true;
  }

  // Check for continuous modifications without trigger words
  // e.g., "This character gets +2 {S}" (without "When" or "Whenever")
  if (
    text.match(/\b(?:gets?|gains?)\s+[+-]\d+\s+\{[SWL]\}/i) &&
    !text.match(/^(?:When|Whenever|At the)\s+/i)
  ) {
    return true;
  }

  // Check for "Chosen X gains/gets" patterns (static targeted modifications)
  // e.g., "Chosen character gains Rush this turn"
  if (
    text.match(/^Chosen\s+(?:character|item|location)s?\s+(?:gains?|gets?)\s+/i)
  ) {
    return true;
  }

  // Check for enters play conditions (typically static)
  if (text.match(/\benters?\s+play\s+exerted/i)) {
    return true;
  }

  // Check for "While" at start (conditional static ability)
  if (text.match(/^While\s+/i)) {
    return true;
  }

  return false;
}
