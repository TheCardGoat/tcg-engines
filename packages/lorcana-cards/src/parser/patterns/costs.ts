/**
 * Cost Patterns
 *
 * Patterns for matching ability cost components in activated abilities.
 */

/**
 * Pattern for exert cost: {E}
 */
export const EXERT_PATTERN = /^\{E\}$/;

/**
 * Pattern for ink cost: N {I}
 * Captures: ink amount (either {d} or numeric)
 */
export const INK_PATTERN = /^(\{d\}|\d+) \{I\}$/;

/**
 * Pattern for combined exert and ink cost: {E}, N {I}
 * Captures: ink amount
 */
export const EXERT_AND_INK_PATTERN = /^\{E\},\s*(\{d\}|\d+) \{I\}$/;

/**
 * Pattern for combined exert and banish cost: {E}, Banish this X
 * Captures: what to banish (item or character)
 */
export const EXERT_AND_BANISH_PATTERN =
  /^\{E\},\s*Banish this (item|character)$/;

/**
 * Pattern for banish self cost
 * Matches: "Banish this item", "Banish this character"
 */
export const BANISH_SELF_PATTERN = /^Banish this (item|character)$/;

/**
 * Pattern for discard cost
 * Matches: "Choose and discard N cards", "Choose and discard a card"
 */
export const DISCARD_PATTERN = /^Choose and discard (a|an|\{d\}|\d+) cards?$/;

/**
 * Pattern for cost separator
 * Matches: " - ", " − " (en dash), " – " (em dash), " : ", or "- " at start
 * Used to detect where cost ends and effect begins
 */
export const COST_SEPARATOR_PATTERN = /\s*[-−–—:]\s+/;

/**
 * Combined cost patterns export
 */
export const COST_PATTERNS = {
  exert: EXERT_PATTERN,
  ink: INK_PATTERN,
  exertAndInk: EXERT_AND_INK_PATTERN,
  exertAndBanish: EXERT_AND_BANISH_PATTERN,
  banishSelf: BANISH_SELF_PATTERN,
  discard: DISCARD_PATTERN,
  costSeparator: COST_SEPARATOR_PATTERN,
} as const;

/**
 * Check if text contains a cost separator (indicating an activated ability)
 */
export function hasActivatedAbilityCost(text: string): boolean {
  // Must start with a cost pattern and contain separator
  const hasExert = /^\{E\}/.test(text);
  const hasInk = /^(\{d\}|\d+) \{I\}/.test(text);
  const hasBanish = /^Banish this/.test(text);
  const hasDiscard = /^Choose and discard/.test(text);

  const hasSeparator = COST_SEPARATOR_PATTERN.test(text);

  return (hasExert || hasInk || hasBanish || hasDiscard) && hasSeparator;
}
