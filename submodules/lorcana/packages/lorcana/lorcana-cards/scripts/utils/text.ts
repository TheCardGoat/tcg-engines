/**
 * Shared text utilities for card generation scripts.
 */

/**
 * Clean rules text by removing HTML tags (used when merging or falling back to Ravensburger text).
 */
export function cleanRulesText(text: string): string {
  if (!text) return "";

  return text
    .replace(/<b>/g, "")
    .replace(/<\/b>/g, "")
    .replace(/<i>/g, "")
    .replace(/<\/i>/g, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<mark>/g, "")
    .replace(/<\/mark>/g, "")
    .trim();
}
