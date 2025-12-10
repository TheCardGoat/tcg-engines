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
  // Normalize to NFC (canonical composition) to ensure consistent string representation
  // This is critical for matching manual overrides where keys might be composed differently than inputs
  return text.normalize("NFC").trim().replace(/\s+/g, " "); // Collapse multiple spaces into one
}

/**
 * Extract named ability prefix (ALL CAPS text before the effect)
 *
 * Named abilities in Lorcana are written in ALL CAPS before the ability text:
 * - "DARK KNOWLEDGE Whenever this character quests, you may draw a card."
 * - "{d},{d} MEDICAL PROCEDURES {E} - Choose one:"
 * - "IT WORKS! Whenever you play an item, you may draw a card."
 * - "DON'T BE AFRAID Your Puppy characters gain Ward."
 * - "LOOK ALIVE, YOU SWABS! Characters gain Rush while here."
 * - "WHAT HAVE YOU DONE?! This character enters play with {d} damage."
 *
 * Special case: Mixed case names like "I'm late!" are also extracted since they
 * represent stylized ability names in the game.
 *
 * @param text - Ability text
 * @returns Object with name and remaining text, or undefined if no named prefix
 */
export function extractNamedAbilityPrefix(
  text: string,
): { name: string; remainingText: string } | undefined {
  // Match ALL CAPS name at start using lookahead to determine end of name
  // The name ends when we encounter a word starting with lowercase or certain trigger words
  //
  // Pattern breakdown:
  // ^                                    - Start of string
  // (?:(?:\{d\}|[\d,])+\s+)?             - Optional numeric prefix like "{d},{d} " or "5,6 "
  // ([A-Z0-9][A-Z0-9a-z\s!?.,'\-]+?)     - Name: starts with uppercase/digit, contains letters/punctuation (non-greedy)
  // \s+                                  - Whitespace separator
  // (?=\{[EDISLW]\}|When|Whenever|This|Your|At |During|While|[A-Z][a-z]|Opponents|Characters|Opposing|Damage|Skip|Each|Chosen)
  //                                      - Lookahead: must be followed by common ability start words or symbols
  const match = text.match(
    /^(?:(?:\{d\}|[\d,])+\s+)?([A-Z0-9][A-Z0-9a-z\s!?.,'-]+?)\s+(?=\{[EDISLW]\}|When|Whenever|This|Your|At |During|While|[A-Z][a-z]|Opponents|Characters|Opposing|Damage|Skip|Each|Chosen)/,
  );

  if (match) {
    const name = match[1].trim();
    // Extract everything after the name
    const nameEndIndex = text.indexOf(name) + name.length;
    const remainingText = text.substring(nameEndIndex).trim();

    // Count uppercase letters
    const uppercaseCount = (name.match(/[A-Z]/g) || []).length;
    const totalLetters = (name.match(/[A-Za-z]/g) || []).length;

    // Special case: Single uppercase letter followed by apostrophe and lowercase (e.g., "I'm late!")
    // This is a stylized ability name that should be accepted
    const isSingleLetterStylized = /^[A-Z]'[a-z]/.test(name);

    // Must have at least 2 uppercase letters OR be a stylized single-letter name
    // Allow lower threshold (30%) to handle mixed case stylized names
    if (
      (uppercaseCount >= 2 && uppercaseCount >= totalLetters * 0.3) ||
      isSingleLetterStylized
    ) {
      // Verify remaining text exists and doesn't start with all caps (to avoid matching "RUSH" alone)
      // Must have at least one lowercase letter or special character in remaining text
      if (remainingText && !/^[A-Z\s]+$/.test(remainingText)) {
        return { name, remainingText };
      }
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
