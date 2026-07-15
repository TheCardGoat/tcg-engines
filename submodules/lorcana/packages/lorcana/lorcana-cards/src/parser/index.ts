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
 */
export function normalizeToPattern(text: string): string {
  let result = text.replace(/\{(\d+)\}/g, "{d}");
  result = result.replace(/([+-]?)(\d+)/g, (_match, sign) => {
    return sign ? `${sign}{d}` : "{d}";
  });
  return result;
}

/**
 * Extract numeric values from original text that correspond to {d} positions in normalized pattern
 */
export function extractNumericValues(originalText: string, normalizedPattern: string): number[] {
  const normalizedOriginal = normalizeToPattern(originalText);
  const normalized1 = normalizedOriginal.replace(/\s+/g, " ").trim();
  const normalized2 = normalizedPattern.replace(/\s+/g, " ").trim();

  if (normalized1 !== normalized2) {
    return [];
  }

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
 */
export function replacePlaceholders(text: string, values: number[]): string {
  if (values.length === 0) {
    return text;
  }

  let valueIndex = 0;
  const result = text.replace(/([+-]?)\{d\}/g, (match, sign) => {
    if (valueIndex >= values.length) {
      return match;
    }
    const value = values[valueIndex++];
    if (sign === "-") return `-${Math.abs(value)}`;
    if (sign === "+") return `+${Math.abs(value)}`;
    return value.toString();
  });
  return result;
}

/**
 * Resolve {d} placeholders in text by extracting values from original text.
 *
 * @param normalizedText - Text with {d} placeholders (e.g., from Lorcast)
 * @param originalText - Original text with actual numbers (e.g., from Ravensburger)
 * @returns Resolved text with {d} replaced by actual numbers
 */
export function resolvePlaceholders(normalizedText: string, originalText: string): string {
  const values = extractNumericValues(originalText, normalizedText);
  if (values.length === 0) {
    return normalizedText;
  }
  return replacePlaceholders(normalizedText, values);
}
