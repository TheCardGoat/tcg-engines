/**
 * Effect Pattern Definitions
 *
 * Regex patterns for parsing Riftbound effect text.
 */

// ============================================================================
// Movement Effect Patterns
// ============================================================================

/**
 * Pattern to match recall effects: "Recall me/a unit [exhausted]."
 *
 * Captures:
 * - Group 1: Target ("me", "a unit", "that unit", etc.)
 * - Group 2: "exhausted" modifier (optional)
 *
 * @example "Recall me." -> ["me", undefined]
 * @example "Recall me exhausted." -> ["me", "exhausted"]
 * @example "Recall a unit." -> ["a unit", undefined]
 * @example "Recall that unit exhausted." -> ["that unit", "exhausted"]
 */
export const RECALL_PATTERN =
  /^Recall (me|a unit|that unit|an? (?:friendly |enemy )?unit)(?:\s+(exhausted))?\.?$/i;

/**
 * Pattern to match basic move effects: "Move a/an [controller] unit(s) [to location]."
 *
 * Captures:
 * - Group 1: Quantity ("a", "an", "up to N")
 * - Group 2: Controller ("friendly ", "enemy ", or empty)
 * - Group 3: Target type ("unit", "units")
 * - Group 4: Destination ("to base", "to here", etc.) - optional
 *
 * @example "Move a friendly unit." -> ["a", "friendly ", "unit", undefined]
 * @example "Move an enemy unit to here." -> ["an", "enemy ", "unit", "to here"]
 * @example "Move up to 2 friendly units to base." -> ["up to 2", "friendly ", "units", "to base"]
 */
export const MOVE_BASIC_PATTERN =
  /^Move (a|an|up to \d+) (friendly |enemy )?(units?)(?:\s+(to (?:base|here|its base|a battlefield|battlefield)))?(?: and ready it)?\.?$/i;

/**
 * Pattern to match move effects with from/to locations:
 * "Move a unit from [location] to [location]."
 *
 * Captures:
 * - Group 1: Quantity ("a", "an")
 * - Group 2: Target type ("unit", "units")
 * - Group 3: From location
 * - Group 4: To location
 *
 * @example "Move a unit from a battlefield to its base." -> ["a", "unit", "a battlefield", "its base"]
 */
export const MOVE_FROM_TO_PATTERN =
  /^Move (a|an) (units?) from (a battlefield|battlefield|base|here) to (its base|base|here|a battlefield|battlefield)\.?$/i;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if text matches a recall pattern
 */
export function isRecallEffect(text: string): boolean {
  return RECALL_PATTERN.test(text);
}

/**
 * Check if text matches a move pattern
 */
export function isMoveEffect(text: string): boolean {
  return MOVE_BASIC_PATTERN.test(text) || MOVE_FROM_TO_PATTERN.test(text);
}

/**
 * Parse location string to Location type
 */
export function parseLocationString(
  locationStr: string,
): "base" | "battlefield" | "here" {
  const normalized = locationStr.toLowerCase().trim();

  if (
    normalized === "base" ||
    normalized === "its base" ||
    normalized === "to base" ||
    normalized === "to its base"
  ) {
    return "base";
  }
  if (normalized === "here" || normalized === "to here") {
    return "here";
  }
  if (
    normalized === "battlefield" ||
    normalized === "a battlefield" ||
    normalized === "to battlefield" ||
    normalized === "to a battlefield"
  ) {
    return "battlefield";
  }

  // Default to base for unrecognized locations
  return "base";
}
