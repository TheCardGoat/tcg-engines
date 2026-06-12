import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { theHeistRetailStarterDeckLegends } from "./legends/index.ts";
import { theHeistRetailStarterDeckUnits } from "./units/index.ts";
import { theHeistRetailStarterDeckGear } from "./gear/index.ts";
import { theHeistRetailStarterDeckPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const theHeistRetailStarterDeckCards = [
  ...theHeistRetailStarterDeckLegends,
  ...theHeistRetailStarterDeckUnits,
  ...theHeistRetailStarterDeckGear,
  ...theHeistRetailStarterDeckPrograms,
] satisfies StructuredCardDefinition[];

export function getTheHeistRetailStarterDeckCardBySlug(
  slug: string,
): StructuredCardDefinition | undefined {
  return theHeistRetailStarterDeckCards.find((card) => card.slug === slug);
}
