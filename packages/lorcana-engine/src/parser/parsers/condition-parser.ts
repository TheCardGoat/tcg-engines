/**
 * Condition Parser
 *
 * Parses condition phrases from ability text into Condition types.
 * Handles:
 * - Named character conditions ("if you have a character named X" or "you have a character named X")
 * - Resource conditions ("if you have no cards in hand")
 * - State conditions ("while this character has damage")
 * - Contextual conditions ("while challenging")
 * - Item conditions ("if you have 3 or more items")
 * - Comparison conditions ("if an opponent has more lore than you")
 *
 * Note: Patterns support both with and without the "if" prefix since the splitting
 * function removes the "if" prefix for conditional effects.
 */

import type { Condition } from "../../cards/abilities/types/condition-types";
import {
  IF_CARDS_IN_HAND_PATTERN,
  IF_CHARACTERS_IN_PLAY_PATTERN,
  IF_NO_CARDS_IN_HAND_PATTERN,
  IF_OPPONENT_HAS_MORE_LORE_PATTERN,
  IF_OPPONENT_HAS_NO_CHARACTERS_PATTERN,
  IF_THIS_HAS_DAMAGE_PATTERN,
  IF_THIS_HAS_NO_DAMAGE_PATTERN,
  IF_USED_SHIFT_PATTERN,
  IF_YOU_HAVE_AN_ITEM_PATTERN,
  IF_YOU_HAVE_FLOODBORN_PATTERN,
  IF_YOU_HAVE_ITEMS_PATTERN,
  IF_YOU_HAVE_NAMED_CHARACTER_PATTERN,
  IN_CHALLENGE_PATTERN,
  WHILE_AT_LOCATION_PATTERN,
  WHILE_CHALLENGING_PATTERN,
  WHILE_DAMAGED_PATTERN,
  WHILE_EXERTED_PATTERN,
  WHILE_NO_DAMAGE_PATTERN,
  WHILE_QUESTING_PATTERN,
  YOU_MAY_PATTERN,
} from "../patterns/conditions";

/**
 * Parse condition from text
 *
 * @param text - Text containing condition phrase (may or may not have "if" prefix)
 * @returns Condition object or undefined if not parsable
 */
export function parseCondition(text: string): Condition | undefined {
  if (!text) return undefined;

  // Normalize: add "if " prefix if not present for easier pattern matching
  const normalizedText = /^(if|while)\s+/i.test(text) ? text : `if ${text}`;

  // Player choice (optional effects)
  if (YOU_MAY_PATTERN.test(normalizedText)) {
    return { type: "player-choice" };
  }

  // Named character conditions
  const characterNameMatch = normalizedText.match(
    IF_YOU_HAVE_NAMED_CHARACTER_PATTERN,
  );
  if (characterNameMatch) {
    return {
      type: "has-named-character",
      name: characterNameMatch[1],
      controller: "you",
    };
  }

  // Floodborn condition
  if (IF_YOU_HAVE_FLOODBORN_PATTERN.test(normalizedText)) {
    return {
      type: "has-character-with-classification",
      classification: "Floodborn",
      controller: "you",
    };
  }

  // Item conditions
  const itemsMatch = normalizedText.match(IF_YOU_HAVE_ITEMS_PATTERN);
  if (itemsMatch) {
    const count = Number.parseInt(itemsMatch[1], 10);
    return {
      type: "has-item-count",
      controller: "you",
      comparison: "greater-or-equal",
      count,
    };
  }

  if (IF_YOU_HAVE_AN_ITEM_PATTERN.test(normalizedText)) {
    return {
      type: "has-item-count",
      controller: "you",
      comparison: "greater-or-equal",
      count: 1,
    };
  }

  // Resource conditions
  if (IF_NO_CARDS_IN_HAND_PATTERN.test(normalizedText)) {
    return {
      type: "resource-count",
      what: "cards-in-hand",
      controller: "you",
      comparison: "equal",
      value: 0,
    };
  }

  const cardsInHandMatch = normalizedText.match(IF_CARDS_IN_HAND_PATTERN);
  if (cardsInHandMatch) {
    const count = Number.parseInt(cardsInHandMatch[1], 10);
    const comparison = normalizedText.includes("more")
      ? "greater-or-equal"
      : "less-or-equal";
    return {
      type: "resource-count",
      what: "cards-in-hand",
      controller: "you",
      comparison,
      value: count,
    };
  }

  const charactersInPlayMatch = normalizedText.match(
    IF_CHARACTERS_IN_PLAY_PATTERN,
  );
  if (charactersInPlayMatch) {
    const count = Number.parseInt(charactersInPlayMatch[1], 10);
    return {
      type: "resource-count",
      what: "characters",
      controller: "you",
      comparison: "greater-or-equal",
      value: count,
    };
  }

  // State conditions - "if this character has..."
  if (IF_THIS_HAS_DAMAGE_PATTERN.test(normalizedText)) {
    return { type: "has-any-damage" };
  }

  if (IF_THIS_HAS_NO_DAMAGE_PATTERN.test(normalizedText)) {
    return { type: "no-damage" };
  }

  // State conditions - "while..."
  if (WHILE_DAMAGED_PATTERN.test(normalizedText)) {
    return { type: "has-any-damage" };
  }

  if (WHILE_NO_DAMAGE_PATTERN.test(normalizedText)) {
    return { type: "no-damage" };
  }

  if (WHILE_EXERTED_PATTERN.test(normalizedText)) {
    return { type: "is-exerted" };
  }

  if (WHILE_AT_LOCATION_PATTERN.test(normalizedText)) {
    return { type: "at-location" };
  }

  // Contextual conditions - "while questing" and "while challenging" both map to in-challenge
  // Note: "while questing" is a restriction on activated abilities, not a condition type
  // For now we'll treat it as in-challenge for contextual keywords
  if (
    WHILE_CHALLENGING_PATTERN.test(normalizedText) ||
    IN_CHALLENGE_PATTERN.test(normalizedText)
  ) {
    return { type: "in-challenge" };
  }

  if (WHILE_QUESTING_PATTERN.test(normalizedText)) {
    // "While questing" is typically used for conditional keywords like "Resist +2 while questing"
    // This should map to in-challenge for now, as questing is a challenge-like context
    return { type: "in-challenge" };
  }

  // Comparison conditions
  if (IF_OPPONENT_HAS_MORE_LORE_PATTERN.test(normalizedText)) {
    return {
      type: "comparison",
      left: { type: "lore", controller: "opponent" },
      comparison: "greater",
      right: { type: "lore", controller: "you" },
    };
  }

  if (IF_OPPONENT_HAS_NO_CHARACTERS_PATTERN.test(normalizedText)) {
    return {
      type: "resource-count",
      what: "characters",
      controller: "opponent",
      comparison: "equal",
      value: 0,
    };
  }

  // Used Shift condition
  if (IF_USED_SHIFT_PATTERN.test(normalizedText)) {
    return { type: "used-shift" };
  }

  // Could not parse condition
  return undefined;
}

/**
 * Extract condition from "if X" or "while X" phrase
 *
 * @param text - Full ability text
 * @returns Extracted condition text or undefined
 */
export function extractConditionText(text: string): string | undefined {
  // Match "if X" or "while X" patterns
  const ifMatch = text.match(/,?\s+if (.+?)(?:[,.]|$)/i);
  if (ifMatch) {
    return ifMatch[1].trim();
  }

  const whileMatch = text.match(/,?\s+while (.+?)(?:[,.]|$)/i);
  if (whileMatch) {
    return whileMatch[1].trim();
  }

  return undefined;
}
