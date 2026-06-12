/**
 * Official Disney Lorcana TCG colors.
 * Brand colors (Indigo, Illuminary Gold, Parchment, Kelp) and ink colors (Amber, Amethyst, Emerald, Ruby, Sapphire, Steel).
 */

/** Brand / UI palette */
export const LORCANA_BRAND = {
  /** Lorcana Indigo – primary brand */
  indigo: { hex: "#373b70", rgb: "55, 59, 112" as const },
  /** Illuminary Gold – accents, borders */
  illuminaryGold: { hex: "#d3ba84", rgb: "211, 186, 132" as const },
  /** Parchment – light surfaces */
  parchment: { hex: "#e3caa8", rgb: "227, 202, 168" as const },
  /** Kelp – dark background / text */
  kelp: { hex: "#1c1c1a", rgb: "28, 28, 26" as const },
} as const;

/** Ink colors (card ink types) – official hex values */
export const LORCANA_INK = {
  amber: { hex: "#f4b322", rgb: "244, 179, 34" as const },
  amethyst: { hex: "#7b4182", rgb: "123, 65, 130" as const },
  emerald: { hex: "#329045", rgb: "50, 144, 69" as const },
  ruby: { hex: "#d60038", rgb: "214, 0, 56" as const },
  sapphire: { hex: "#0094c8", rgb: "0, 148, 200" as const },
  steel: { hex: "#97a3af", rgb: "151, 163, 175" as const },
} as const;

export type LorcanaInkName = keyof typeof LORCANA_INK;

/** All Lorcana ink names in display order */
export const LORCANA_INK_NAMES: readonly LorcanaInkName[] = [
  "amber",
  "amethyst",
  "emerald",
  "ruby",
  "sapphire",
  "steel",
] as const;

/** Get hex for an ink color */
export function getInkHex(ink: LorcanaInkName): string {
  return LORCANA_INK[ink].hex;
}

/** Get CSS rgb(...) string for an ink color */
export function getInkRgb(ink: LorcanaInkName): string {
  return `rgb(${LORCANA_INK[ink].rgb})`;
}

/** Get CSS rgba(...) string for an ink color with optional alpha */
export function getInkRgba(ink: LorcanaInkName, alpha = 1): string {
  return `rgba(${LORCANA_INK[ink].rgb}, ${alpha})`;
}
