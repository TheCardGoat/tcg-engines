/**
 * Printed-name identity for filters and multi-pick constraints.
 *
 * Catalog `names` are often slugs (`snatch-red`); i18n display names drop
 * pitch. "Cards with different names" compares this identity, not canonical id.
 */

export function compactPrintedName(value: string): string {
  return value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "");
}

/** `token:hyper-driver` / slug `hyper-driver-red` → "Hyper Driver". */
export function printableNameFromSlug(slug: string): string | null {
  const trimmed = slug.startsWith("token:") ? slug.slice("token:".length) : slug;
  const isTokenSlug = slug.startsWith("token:");
  const isHyphenSlug = trimmed.includes("-");
  const isLowercaseWord = /^[a-z]+$/.test(trimmed);
  if (!isTokenSlug && !isHyphenSlug && !isLowercaseWord) return null;
  const parts = trimmed.split("-").filter((part) => !["red", "yellow", "blue"].includes(part));
  if (parts.length === 0) return null;
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

/** Compact comparison key shared by Snatch Red and Snatch Yellow (`snatch`). */
export function printedIdentityKey(names: readonly string[], canonicalId?: string | null): string {
  for (const name of names) {
    const fromSlug = printableNameFromSlug(name);
    if (fromSlug) return compactPrintedName(fromSlug);
    if (name.trim()) return compactPrintedName(name);
  }
  if (canonicalId) {
    const fromId = printableNameFromSlug(canonicalId);
    if (fromId) return compactPrintedName(fromId);
    return compactPrintedName(canonicalId);
  }
  return "";
}
