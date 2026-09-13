import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { boxToppersRetailLegends } from "./legends/index.ts";
import { boxToppersRetailUnits } from "./units/index.ts";
import { boxToppersRetailGear } from "./gear/index.ts";
import { boxToppersRetailPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const boxToppersRetailCards: StructuredCardDefinition[] = [
  ...boxToppersRetailLegends,
  ...boxToppersRetailUnits,
  ...boxToppersRetailGear,
  ...boxToppersRetailPrograms,
];

export function getBoxToppersRetailCardBySlug(slug: string): StructuredCardDefinition | undefined {
  return boxToppersRetailCards.find((card) => card.slug === slug);
}
