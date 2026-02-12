/**
 * Numeric Value Extractor
 *
 * Extracts numeric values from original card text and replaces {d} placeholders
 * in normalized text with actual numbers.
 *
 * This module handles the conversion between:
 * - Original text: "Gain 3 lore" (with actual numbers)
 * - Normalized text: "Gain {d} lore" (with {d} placeholders)
 */

/**
 * Normalize text by replacing all numeric values with {d} placeholders
 *
 * @param text - Original text with numbers
 * @returns Normalized text with {d} placeholders
 *
 * @example
 * normalizeToPattern("Gain 3 lore") // "Gain {d} lore"
 * normalizeToPattern("Deal +5 damage") // "Deal +{d} damage"
 * normalizeToPattern("Pay {2} {I}") // "Pay {d} {I}" (converts {number} to {d})
 * normalizeToPattern("{E}, {2} {I}") // "{E}, {d} {I}" (preserves symbols like {E})
 */
export function normalizeToPattern(text: string): string {
  // First, handle numbers inside curly braces like {2}, {3}, etc.
  // These should be converted to {d}, but we need to preserve symbol placeholders
  // Symbols are: {E}, {I}, {S}, {W}, {L}, {D}, {d}
  // So we only convert {number} where number is purely digits
  let result = text.replace(/\{(\d+)\}/g, "{d}");

  // Then, replace standalone numbers (including those with +/- prefix) with {d}
  // Handle cases like "+3", "-2", "3", etc.
  // But avoid matching numbers that are already inside braces (we already handled those)
  result = result.replace(/([+-]?)(\d+)/g, (match, sign) => sign ? `${sign}{d}` : "{d}");

  return result;
}

/**
 * Extract numeric values from original text that correspond to {d} positions in normalized pattern
 *
 * The algorithm:
 * 1. Normalize both texts to compare patterns
 * 2. Verify they match (same pattern)
 * 3. Extract numbers from original text in order
 *
 * @param originalText - Text with actual numbers (e.g., "Gain 3 lore")
 * @param normalizedPattern - Text with {d} placeholders (e.g., "Gain {d} lore")
 * @returns Array of numeric values in order of appearance, or empty array if patterns don't match
 *
 * @example
 * extractNumericValues("Gain 3 lore", "Gain {d} lore") // [3]
 * extractNumericValues("Deal 2 damage to chosen character", "Deal {d} damage to chosen character") // [2]
 * extractNumericValues("Pay 1 {I} less, gain 2 lore", "Pay {d} {I} less, gain {d} lore") // [1, 2]
 */
export function extractNumericValues(
  originalText: string,
  normalizedPattern: string,
): number[] {
  // Normalize the original text to compare patterns
  const normalizedOriginal = normalizeToPattern(originalText);

  // Normalize whitespace for comparison
  const normalized1 = normalizedOriginal.replace(/\s+/g, " ").trim();
  const normalized2 = normalizedPattern.replace(/\s+/g, " ").trim();

  // If patterns don't match, return empty array
  if (normalized1 !== normalized2) {
    return [];
  }

  // Extract all numbers from original text (including signs)
  const numbers: number[] = [];
  const numberRegex = /([+-]?)(\d+)/g;
  let match;

  while ((match = numberRegex.exec(originalText)) !== null) {
    const sign = match[1] === "-" ? -1 : 1;
    const value = Number.parseInt(match[2], 10);
    numbers.push(sign * value);
  }

  return numbers;
}

/**
 * Replace {d} placeholders in text with actual numeric values
 *
 * @param text - Text with {d} placeholders
 * @param values - Array of numeric values to use for replacement
 * @returns Text with {d} replaced by values, or original text if values don't match
 *
 * @example
 * replacePlaceholders("Gain {d} lore", [3]) // "Gain 3 lore"
 * replacePlaceholders("Pay {d} {I} less, gain {d} lore", [1, 2]) // "Pay 1 {I} less, gain 2 lore"
 */
export function replacePlaceholders(text: string, values: number[]): string {
  if (values.length === 0) {
    return text;
  }

  let result = text;
  let valueIndex = 0;

  // Replace {d} placeholders with values
  // Handle cases with optional signs: +{d}, -{d}, or just {d}
  result = result.replace(/([+-]?)\{d\}/g, (match, sign) => {
    if (valueIndex >= values.length) {
      // Not enough values, return original placeholder
      return match;
    }

    const value = values[valueIndex++];
    // If there's a sign in the pattern, use it with the absolute value
    // Otherwise, use the value as-is (preserving its sign)
    if (sign === "-") {
      return `-${Math.abs(value)}`;
    }
    if (sign === "+") {
      return `+${Math.abs(value)}`;
    }
    // No sign in pattern, use value as-is (may be negative)
    return value.toString();
  });

  return result;
}

/**
 * Resolve {d} placeholders in text by extracting values from original text
 *
 * This is the main function that combines extraction and replacement.
 *
 * @param normalizedText - Text with {d} placeholders (e.g., from Lorcast)
 * @param originalText - Original text with actual numbers (e.g., from Ravensburger)
 * @returns Resolved text with {d} replaced by actual numbers, or original normalizedText if extraction fails
 *
 * @example
 * resolvePlaceholders("Gain {d} lore", "Gain 3 lore") // "Gain 3 lore"
 * resolvePlaceholders("Pay {d} {I} less", "Pay 1 {I} less") // "Pay 1 {I} less"
 */
export function resolvePlaceholders(
  normalizedText: string,
  originalText: string,
): string {
  // Extract numeric values from original text
  const values = extractNumericValues(originalText, normalizedText);

  // If extraction failed (patterns don't match), return normalized text as-is
  if (values.length === 0) {
    return normalizedText;
  }

  // Replace placeholders with extracted values
  return replacePlaceholders(normalizedText, values);
}
