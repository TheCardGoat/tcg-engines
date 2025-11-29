/**
 * Target Patterns
 *
 * Regex patterns for matching target phrases in ability text.
 * Used to extract who/what an effect applies to.
 */

/**
 * Self-reference patterns
 */
export const SELF_PATTERNS = [
  /\bthis character\b/i,
  /\bthis card\b/i,
  /\bthis item\b/i,
  /\bthis location\b/i,
  /\bhe\b/i,
  /\bshe\b/i,
  /\bit\b/i,
];

/**
 * Chosen target patterns
 */
export const CHOSEN_CHARACTER_PATTERN = /\bchosen (?:opposing )?character\b/i;
export const CHOSEN_OPPOSING_CHARACTER_PATTERN =
  /\bchosen opposing character\b/i;
export const CHOSEN_CHARACTER_OF_YOURS_PATTERN =
  /\bchosen character of yours\b/i;
export const CHOSEN_ITEM_PATTERN = /\bchosen item\b/i;
export const CHOSEN_LOCATION_PATTERN = /\bchosen location\b/i;

/**
 * Group target patterns
 */
export const YOUR_CHARACTERS_PATTERN = /\byour characters?\b/i;
export const ALL_CHARACTERS_PATTERN = /\ball characters?\b/i;
export const EACH_OPPOSING_CHARACTER_PATTERN = /\beach opposing character\b/i;
export const ALL_OPPOSING_CHARACTERS_PATTERN = /\ball opposing characters?\b/i;

/**
 * Player target patterns
 * Now includes "Chosen player" pattern
 */
export const YOU_PATTERN = /\byou\b/i;
export const OPPONENT_PATTERN = /\bopponent\b/i;
export const EACH_PLAYER_PATTERN = /\beach player\b/i;
export const EACH_OPPONENT_PATTERN = /\beach opponent\b/i;
export const CHOSEN_PLAYER_PATTERN = /\bchosen player\b/i;

/**
 * Check if text contains a self-reference
 */
export function hasSelfReference(text: string): boolean {
  return SELF_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Check if text contains a chosen target
 */
export function hasChosenTarget(text: string): boolean {
  return (
    CHOSEN_CHARACTER_PATTERN.test(text) ||
    CHOSEN_OPPOSING_CHARACTER_PATTERN.test(text) ||
    CHOSEN_CHARACTER_OF_YOURS_PATTERN.test(text) ||
    CHOSEN_ITEM_PATTERN.test(text) ||
    CHOSEN_LOCATION_PATTERN.test(text) ||
    CHOSEN_PLAYER_PATTERN.test(text)
  );
}
