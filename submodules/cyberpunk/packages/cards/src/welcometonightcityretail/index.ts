import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { welcomeToNightCityRetailLegends } from "./legends/index.ts";
import { welcomeToNightCityRetailUnits } from "./units/index.ts";
import { welcomeToNightCityRetailGear } from "./gear/index.ts";
import { welcomeToNightCityRetailPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const welcomeToNightCityRetailCards = [
  ...welcomeToNightCityRetailLegends,
  ...welcomeToNightCityRetailUnits,
  ...welcomeToNightCityRetailGear,
  ...welcomeToNightCityRetailPrograms,
] satisfies StructuredCardDefinition[];

export function getWelcomeToNightCityRetailCardBySlug(
  slug: string,
): StructuredCardDefinition | undefined {
  return welcomeToNightCityRetailCards.find((card) => card.slug === slug);
}
