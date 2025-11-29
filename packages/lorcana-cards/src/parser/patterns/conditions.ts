/**
 * Condition Patterns
 *
 * Regex patterns for matching conditional phrases in ability text.
 * Used in triggered abilities ("if you have...") and static abilities ("while...").
 */

/**
 * Optional effect pattern ("you may")
 */
export const YOU_MAY_PATTERN = /\byou may\b/i;

/**
 * Character existence patterns
 */
export const IF_YOU_HAVE_NAMED_CHARACTER_PATTERN =
  /\bif you have (?:a )?character named ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/i;
export const IF_YOU_HAVE_CHARACTER_WITH_PATTERN =
  /\bif you have (?:a )?character with ([A-Z][a-z]+)\b/i;
export const IF_YOU_HAVE_FLOODBORN_PATTERN =
  /\bif you have (?:a )?Floodborn character\b/i;

/**
 * Item existence patterns
 */
export const IF_YOU_HAVE_ITEMS_PATTERN =
  /\bif you have (\d+) or more items?\b/i;
export const IF_YOU_HAVE_AN_ITEM_PATTERN = /\bif you have (?:an? )?item\b/i;

/**
 * Resource condition patterns
 */
export const IF_NO_CARDS_IN_HAND_PATTERN =
  /\bif you have no cards in (?:your )?hand\b/i;
export const IF_CARDS_IN_HAND_PATTERN =
  /\bif you have (\d+) or (?:more|fewer) cards in (?:your )?hand\b/i;
export const IF_CHARACTERS_IN_PLAY_PATTERN =
  /\bif you have (\d+) or more characters in play\b/i;

/**
 * State condition patterns - "if this character has..."
 */
export const IF_THIS_HAS_DAMAGE_PATTERN =
  /\bif (?:this character|he|she|it) has damage\b/i;
export const IF_THIS_HAS_NO_DAMAGE_PATTERN =
  /\bif (?:this character|he|she|it) has no damage\b/i;

/**
 * State condition patterns - "while..." (used in static abilities)
 */
export const WHILE_DAMAGED_PATTERN =
  /\bwhile (?:this character|he|she|it) has damage\b/i;
export const WHILE_NO_DAMAGE_PATTERN =
  /\bwhile (?:this character|he|she|it) has no damage\b/i;
export const WHILE_EXERTED_PATTERN =
  /\bwhile (?:this character|he|she|it) is exerted\b/i;
export const WHILE_AT_LOCATION_PATTERN = /\bwhile (?:at|here)\b/i;

/**
 * Contextual condition patterns
 */
export const WHILE_CHALLENGING_PATTERN = /\bwhile challenging\b/i;
export const WHILE_QUESTING_PATTERN = /\bwhile questing\b/i;
export const IN_CHALLENGE_PATTERN = /\bwhile in a challenge\b/i;

/**
 * Comparison condition patterns
 */
export const IF_OPPONENT_HAS_MORE_LORE_PATTERN =
  /\bif (?:an )?opponent has more lore than you\b/i;
export const IF_OPPONENT_HAS_NO_CHARACTERS_PATTERN =
  /\bif (?:an )?opponent has no characters\b/i;
export const IF_OPPONENT_HAS_FEWER_PATTERN =
  /\bif (?:an )?opponent has (?:fewer|less) (.+?) than you\b/i;

/**
 * Used shift condition
 */
export const IF_USED_SHIFT_PATTERN =
  /\bif you used Shift to play (?:this character|him|her|it)\b/i;

/**
 * Conditional effect detection - "if X, Y" or "if X, Y instead"
 * This pattern ensures we're at the START of the text or after a period/sentence break
 */
export const CONDITIONAL_EFFECT_PATTERN =
  /^(?:if\b.+?,\s*.+)|(?:\.\s*if\b.+?,\s*.+?\s*instead)/i;
export const HAS_INSTEAD_CLAUSE = /\binstead\b/i;

/**
 * Check if text contains a named character condition
 */
export function hasNamedCharacterCondition(text: string): boolean {
  return IF_YOU_HAVE_NAMED_CHARACTER_PATTERN.test(text);
}

/**
 * Extract character name from condition text
 */
export function extractCharacterName(text: string): string | undefined {
  const match = text.match(IF_YOU_HAVE_NAMED_CHARACTER_PATTERN);
  return match?.[1];
}

/**
 * Check if text contains a resource condition
 */
export function hasResourceCondition(text: string): boolean {
  return (
    IF_NO_CARDS_IN_HAND_PATTERN.test(text) ||
    IF_CARDS_IN_HAND_PATTERN.test(text) ||
    IF_CHARACTERS_IN_PLAY_PATTERN.test(text)
  );
}

/**
 * Check if text contains a state condition
 */
export function hasStateCondition(text: string): boolean {
  return (
    WHILE_DAMAGED_PATTERN.test(text) ||
    WHILE_NO_DAMAGE_PATTERN.test(text) ||
    WHILE_EXERTED_PATTERN.test(text) ||
    WHILE_AT_LOCATION_PATTERN.test(text) ||
    IF_THIS_HAS_DAMAGE_PATTERN.test(text) ||
    IF_THIS_HAS_NO_DAMAGE_PATTERN.test(text)
  );
}

/**
 * Check if text contains a conditional effect pattern
 * Returns true only if this is a proper conditional effect, not just any "if" clause
 */
export function hasConditionalEffect(text: string): boolean {
  // Must match one of these patterns:
  // 1. Starts with "if" at beginning: "If X, Y"
  // 2. Has "instead" with "if": "Effect. If X, Y instead"

  // Pattern 1: Starts with "if" and has comma
  if (/^if\s+.+?,\s*.+/i.test(text)) {
    return true;
  }

  // Pattern 2: Has period followed by "if" and "instead"
  if (/\.\s*if\s+.+?,\s*.+?\s+instead/i.test(text)) {
    return true;
  }

  return false;
}

/**
 * Extract condition and effect parts from conditional text
 * Returns [conditionText, thenEffectText, elseEffectText?]
 */
export function splitConditionalEffect(
  text: string,
): [string, string, string?] | undefined {
  // Pattern 1: "Effect. If condition, effect instead"
  // This means: normally do first effect, but if condition, do second effect
  const insteadMatch = text.match(
    /^(.+?)\.\s*[Ii]f\s+(.+?),\s*(.+?)\s+instead\.?$/,
  );
  if (insteadMatch) {
    const [, elseEffect, condition, thenEffect] = insteadMatch;
    return [condition.trim(), thenEffect.trim(), elseEffect.trim()];
  }

  // Pattern 2: "If condition, effect"
  const simpleMatch = text.match(/^[Ii]f\s+(.+?),\s*(.+?)\.?$/);
  if (simpleMatch) {
    const [, condition, thenEffect] = simpleMatch;
    return [condition.trim(), thenEffect.trim()];
  }

  return undefined;
}
