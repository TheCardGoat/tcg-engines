/**
 * Text Preprocessing Utilities
 *
 * Provides functions to normalize and prepare ability text for parsing.
 */

/**
 * Normalize text by trimming whitespace and collapsing multiple spaces
 *
 * @param text - Raw ability text
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " "); // Collapse multiple spaces into one
}

/**
 * Extract named ability prefix (ALL CAPS text before the effect)
 *
 * Named abilities in Lorcana are written in ALL CAPS before the ability text:
 * "DARK KNOWLEDGE Whenever this character quests, you may draw a card."
 *
 * @param text - Ability text
 * @returns Object with name and remaining text, or undefined if no named prefix
 */
export function extractNamedAbilityPrefix(
  text: string,
): { name: string; remainingText: string } | undefined {
  // Match ALL CAPS words at the start (at least 2 uppercase letters separated by spaces)
  // followed by at least one word that starts with a non-uppercase character
  // This handles: "DARK KNOWLEDGE Whenever...", "LET IT GO When...", "MAGIC HAIR {E}..."
  const match = text.match(/^([A-Z]{2,}(?:\s+[A-Z]{2,})*)\s+(.+)$/);

  if (match) {
    const name = match[1].trim();
    const remainingText = match[2].trim();

    // Verify remaining text doesn't start with all caps (to avoid matching "RUSH" alone)
    // Must have at least one lowercase letter or special character in remaining text
    if (!/^[A-Z\s]+$/.test(remainingText)) {
      return { name, remainingText };
    }
  }

  return undefined;
}

/**
 * Resolve symbol placeholders in text
 *
 * Symbols in Lorcana:
 * - {d} - numeric value placeholder
 * - {E} - exert symbol
 * - {I} - ink symbol
 * - {S} - strength stat
 * - {L} - lore stat
 * - {W} - willpower stat
 *
 * This function currently preserves symbols by default for pattern matching.
 * In the future, we can add options to resolve placeholders.
 *
 * @param text - Text with symbolic placeholders
 * @returns Text with symbols preserved or resolved
 */
export function resolveSymbols(text: string): string {
  // For now, preserve symbols as-is
  // Future: add option to resolve {d} to 0 or extract numbers
  return text;
}
