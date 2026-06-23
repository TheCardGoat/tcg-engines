import type { TheHeistRetailStarterDeckCardDefinition } from "@tcg/cyberpunk-types";
import { theHeistRetailStarterDeckJackieWellesPourOneOutForMe } from "./jackie-welles-pour-one-out-for-me.ts";
import { theHeistRetailStarterDeckVCorporateExile } from "./v-corporate-exile.ts";
import { theHeistRetailStarterDeckViktorVektorSitDownAndRelax } from "./viktor-vektor-sit-down-and-relax.ts";

export { theHeistRetailStarterDeckJackieWellesPourOneOutForMe } from "./jackie-welles-pour-one-out-for-me.ts";
export { theHeistRetailStarterDeckVCorporateExile } from "./v-corporate-exile.ts";
export { theHeistRetailStarterDeckViktorVektorSitDownAndRelax } from "./viktor-vektor-sit-down-and-relax.ts";

export const theHeistRetailStarterDeckLegends = [
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  theHeistRetailStarterDeckVCorporateExile,
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
] satisfies TheHeistRetailStarterDeckCardDefinition[];
