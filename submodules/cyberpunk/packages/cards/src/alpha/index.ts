import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { alphaLegends } from "./legends/index.ts";
import { alphaUnits } from "./units/index.ts";
import { alphaGear } from "./gear/index.ts";
import { alphaPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const alphaCards: StructuredCardDefinition[] = [
  ...alphaLegends,
  ...alphaUnits,
  ...alphaGear,
  ...alphaPrograms,
];

export function getAlphaCardBySlug(slug: string): StructuredCardDefinition | undefined {
  return alphaCards.find((card) => card.slug === slug);
}
