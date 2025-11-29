/**
 * Keyword Ability Patterns
 *
 * Regex patterns for matching keyword abilities.
 * Supports both placeholder format ({d}) and resolved format (numeric values).
 */

/**
 * Pattern for simple keywords (no parameters)
 */
export const SIMPLE_KEYWORD_PATTERN =
  /^(Rush|Ward|Evasive|Bodyguard|Support|Reckless|Vanish|Alert)$/;

/**
 * Pattern for Challenger +N
 * Captures: value (either {d} or numeric)
 */
export const CHALLENGER_PATTERN = /^Challenger \+(\{d\}|\d+)$/;

/**
 * Pattern for Resist +N
 * Captures: value (either {d} or numeric)
 */
export const RESIST_PATTERN = /^Resist \+(\{d\}|\d+)$/;

/**
 * Pattern for Singer N
 * Captures: value (either {d} or numeric)
 */
export const SINGER_PATTERN = /^Singer (\{d\}|\d+)$/;

/**
 * Pattern for Sing Together N
 * Captures: value (either {d} or numeric)
 */
export const SING_TOGETHER_PATTERN = /^Sing Together (\{d\}|\d+)$/;

/**
 * Pattern for Boost N
 * Captures: value (either {d} or numeric)
 * Optional {I} ink symbol may follow
 */
export const BOOST_PATTERN = /^Boost (\{d\}|\d+)(?: \{I\})?$/;

/**
 * Pattern for Shift variants
 * Captures:
 * 1. Shift type (Shift, Puppy Shift, Universal Shift)
 * 2. Cost value (either {d} or numeric)
 * 3. Optional ink symbol {I}
 */
export const SHIFT_PATTERN =
  /^(Shift|Puppy Shift|Universal Shift) (\{d\}|\d+)(?: \{I\})?$/;

/**
 * Combined keyword patterns export
 */
export const KEYWORD_PATTERNS = {
  simpleKeyword: SIMPLE_KEYWORD_PATTERN,
  challenger: CHALLENGER_PATTERN,
  resist: RESIST_PATTERN,
  singer: SINGER_PATTERN,
  singTogether: SING_TOGETHER_PATTERN,
  boost: BOOST_PATTERN,
  shift: SHIFT_PATTERN,
} as const;

/**
 * Check if text matches any keyword pattern
 */
export function isKeywordAbilityText(text: string): boolean {
  return Object.values(KEYWORD_PATTERNS).some((pattern) => pattern.test(text));
}
