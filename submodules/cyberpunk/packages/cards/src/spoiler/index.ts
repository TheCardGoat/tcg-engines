import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";
import { spoilerLegends } from "./legends/index.ts";
import { spoilerUnits } from "./units/index.ts";
import { spoilerGear } from "./gear/index.ts";
import { spoilerPrograms } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const spoilerCards = [
  ...spoilerLegends,
  ...spoilerUnits,
  ...spoilerGear,
  ...spoilerPrograms,
] satisfies SpoilerCardDefinition[];

export function getSpoilerCardBySlug(slug: string): SpoilerCardDefinition | undefined {
  return spoilerCards.find((card) => card.slug === slug);
}
