import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { embracingPowerRetailStarterDeckLegends } from "./legends/index.ts";
import { embracingPowerRetailStarterDeckUnits } from "./units/index.ts";
import { embracingPowerRetailStarterDeckGear } from "./gear/index.ts";
import { embracingPowerRetailStarterDeckPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const embracingPowerRetailStarterDeckCards: StructuredCardDefinition[] = [
  ...embracingPowerRetailStarterDeckLegends,
  ...embracingPowerRetailStarterDeckUnits,
  ...embracingPowerRetailStarterDeckGear,
  ...embracingPowerRetailStarterDeckPrograms,
];

export function getEmbracingPowerRetailStarterDeckCardBySlug(
  slug: string,
): StructuredCardDefinition | undefined {
  return embracingPowerRetailStarterDeckCards.find((card) => card.slug === slug);
}
