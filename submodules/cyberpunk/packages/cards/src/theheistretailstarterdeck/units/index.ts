import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { theHeistRetailStarterDeckDexterDeshawnOneLastChance } from "./dexter-deshawn-one-last-chance.ts";
import { theHeistRetailStarterDeckMt0d12Flathead } from "./mt0d12-flathead.ts";

export { theHeistRetailStarterDeckDexterDeshawnOneLastChance } from "./dexter-deshawn-one-last-chance.ts";
export { theHeistRetailStarterDeckMt0d12Flathead } from "./mt0d12-flathead.ts";

export const theHeistRetailStarterDeckUnits = [
  theHeistRetailStarterDeckDexterDeshawnOneLastChance,
  theHeistRetailStarterDeckMt0d12Flathead,
] satisfies UnitCardDefinition[];
