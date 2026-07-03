import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { prm01Legends } from "./legends/index.ts";
import { prm01Units } from "./units/index.ts";
import { prm01Gear } from "./gear/index.ts";
import { prm01Programs } from "./programs/index.ts";

export * from "./legends/index.ts";
export * from "./units/index.ts";
export * from "./gear/index.ts";
export * from "./programs/index.ts";

export const prm01Cards: StructuredCardDefinition[] = [
  ...prm01Legends,
  ...prm01Units,
  ...prm01Gear,
  ...prm01Programs,
];

export function getPrm01CardBySlug(slug: string): StructuredCardDefinition | undefined {
  return prm01Cards.find((card) => card.slug === slug);
}
