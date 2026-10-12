import gemBlack from "./assets/colors/gem-black.webp";
import gemBlue from "./assets/colors/gem-blue.webp";
import gemGreen from "./assets/colors/gem-green.webp";
import gemRed from "./assets/colors/gem-red.webp";
import gemWhite from "./assets/colors/gem-white.webp";
import { getCard } from "@tcg/alpha-clash-cards";

/** Board palette for resource colors, shared by prompt identity chips and gems. */
export const RESOURCE_COLORS: Record<string, string> = {
  red: "#ed6475",
  blue: "#74b7f5",
  green: "#72cf9c",
  white: "#f3ead4",
  black: "#9287b2",
};

/** Printed resource gems (rule 107.4a) vendored from the assets repository. */
export const RESOURCE_GEMS: Record<string, string> = {
  white: gemWhite,
  blue: gemBlue,
  black: gemBlack,
  red: gemRed,
  green: gemGreen,
};

export function resourceColorHex(color: string): string {
  return RESOURCE_COLORS[color] ?? "#8ea3ad";
}

/** Resource payment option ids are `JSON.stringify([instanceId, color])`. */
export function resourceOptionColor(optionId: string): string | undefined {
  try {
    const [, color] = JSON.parse(optionId) as [string, unknown];
    return typeof color === "string" ? color : undefined;
  } catch {
    return undefined;
  }
}

export function cardColors(definitionId: string): readonly string[] {
  return getCard(definitionId).colors ?? [];
}
