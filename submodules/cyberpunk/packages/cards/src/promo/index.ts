import type { PromoCardDefinition } from "@tcg/cyberpunk-types";
import { promoLegends } from "./legends/index.ts";
import { promoUnits } from "./units/index.ts";
import { promoGear } from "./gear/index.ts";
import { promoPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const promoCards = [
  ...promoLegends,
  ...promoUnits,
  ...promoGear,
  ...promoPrograms,
] satisfies PromoCardDefinition[];

export function getPromoCardBySlug(slug: string): PromoCardDefinition | undefined {
  return promoCards.find((card) => card.slug === slug);
}
