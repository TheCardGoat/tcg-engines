import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { boxTopperRetailLegends } from "./legends/index.ts";
import { boxTopperRetailUnits } from "./units/index.ts";
import { boxTopperRetailGear } from "./gear/index.ts";
import { boxTopperRetailPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const boxToppersRetailCards = [
  ...boxTopperRetailLegends,
  ...boxTopperRetailUnits,
  ...boxTopperRetailGear,
  ...boxTopperRetailPrograms,
] satisfies StructuredCardDefinition[];

export function getBoxToppersRetailCardBySlug(slug: string): StructuredCardDefinition | undefined {
  return boxToppersRetailCards.find((card) => card.slug === slug);
}
