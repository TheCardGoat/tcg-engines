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
 * Referenced target patterns (her, him, them, that card)
 */
export const REFERENCED_PATTERNS = [
  /\bher\b/i,
  /\bhim\b/i,
  /\bthem\b/i,
  /\bthat card\b/i,
];

/**
 * Chosen target patterns
 */
export const CHOSEN_CHARACTER_PATTERN = /\bchosen (?:opposing )?character\b/i;
export const CHOSEN_OPPOSING_CHARACTER_PATTERN =
  /\bchosen opposing character\b/i;
export const CHOSEN_CHARACTER_OF_YOURS_PATTERN =
  /\b(?:chosen character of yours|one of your characters)\b/i;
export const CHOSEN_ITEM_PATTERN = /\bchosen item\b/i;
export const CHOSEN_LOCATION_PATTERN = /\bchosen location\b/i;

/**
 * Group target patterns
 */
export const YOUR_CHARACTERS_PATTERN = /\byour characters?\b/i;
export const ALL_CHARACTERS_PATTERN = /\ball characters?\b/i;
export const EACH_OPPOSING_CHARACTER_PATTERN = /\beach opposing character\b/i;

export const ALL_OPPOSING_CHARACTERS_PATTERN = /\ball opposing characters?\b/i;
export const THE_CHALLENGED_CHARACTER_PATTERN = /\bthe challenged character\b/i;
export const THE_CHALLENGING_CHARACTER_PATTERN =
  /\bthe challenging character\b/i;
export const ALL_ITEMS_PATTERN = /\ball items?\b/i;
export const ALL_OPPOSING_ITEMS_PATTERN = /\ball opposing items?\b/i;
export const ALL_LOCATIONS_PATTERN = /\ball locations?\b/i;
export const ALL_OPPOSING_LOCATIONS_PATTERN = /\ball opposing locations?\b/i;

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
