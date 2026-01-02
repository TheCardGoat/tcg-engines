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
 * Ink color display values for UI
 */
export const INK_COLORS: Record<InkType, string> = {
  amber: "#F5A623",
  amethyst: "#9B59B6",
  emerald: "#27AE60",
  ruby: "#C0392B",
  sapphire: "#2980B9",
  steel: "#7F8C8D",
};

/**
 * Check if a value is a valid ink type
 */
export function isValidInkType(value: unknown): value is InkType {
  return typeof value === "string" && INK_TYPES.includes(value as InkType);
}

/**
 * Alias for backwards compatibility
 */
export const isInkType = isValidInkType;

/**
 * Get the display color for an ink type
 */
export function getInkColor(inkType: InkType): string {
  return INK_COLORS[inkType];
}

/**
 * Get all ink types
 */
export function getAllInkTypes(): readonly InkType[] {
  return INK_TYPES;
}
