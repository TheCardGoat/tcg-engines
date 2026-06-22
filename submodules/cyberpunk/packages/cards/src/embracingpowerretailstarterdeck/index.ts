import type { EmbracingPowerRetailStarterDeckCardDefinition } from "@tcg/cyberpunk-types";
import { embracingPowerRetailStarterDeckUnits } from "./units/index.ts";

export * from "./units/index.ts";

export const embracingPowerRetailStarterDeckCards = [
  ...embracingPowerRetailStarterDeckUnits,
] satisfies EmbracingPowerRetailStarterDeckCardDefinition[];

export function getEmbracingPowerRetailStarterDeckCardBySlug(
  slug: string,
): EmbracingPowerRetailStarterDeckCardDefinition | undefined {
  return embracingPowerRetailStarterDeckCards.find((card) => card.slug === slug);
}
