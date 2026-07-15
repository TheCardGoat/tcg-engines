/**
 * Stage 1: Text Normalization
 *
 * Cleans and normalizes card text before parsing.
 */

export function normalizeText(text: string): string {
  if (!text) return "";

  let clean = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/br>/g, "\n")
    .replace(/\r\n/g, "\n");

  // Collapse multiple spaces
  clean = clean.replace(/[ \t]+/g, " ");

  // Fix common OCR/Data entry issues
  clean = clean.replace(/：/g, ":"); // Full-width colon
  clean = clean.replace(/・/g, "･"); // Normalize dots

  return clean.trim();
}
