/**
 * Ink Types (Rule 2.1.1.2)
 *
 * Six ink colors that define card identity and deck building constraints.
 * A deck can contain cards of at most 2 different ink types.
 */

export const INK_TYPES = [
  "amber",
  "amethyst",
  "emerald",
  "ruby",
  "sapphire",
  "steel",
] as const;

export type InkType = (typeof INK_TYPES)[number];

/**
 * Check if a value is a valid ink type
 */
export function isInkType(value: unknown): value is InkType {
  return typeof value === "string" && INK_TYPES.includes(value as InkType);
}

/**
 * Get all ink types
 */
export function getAllInkTypes(): readonly InkType[] {
  return INK_TYPES;
}
