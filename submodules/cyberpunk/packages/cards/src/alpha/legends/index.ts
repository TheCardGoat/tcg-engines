import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { alphaGoroTakemuraHandsUnclean } from "./goro-takemura-hands-unclean.ts";
import { alphaJackieWellesPourOneOutForMe } from "./jackie-welles-pour-one-out-for-me.ts";
import { alphaSaburoArasakaStubbornPatriach } from "./saburo-arasaka-stubborn-patriach.ts";
import { alphaVCorporateExile } from "./v-corporate-exile.ts";
import { alphaViktorVektorSitDownAndRelax } from "./viktor-vektor-sit-down-and-relax.ts";
import { alphaYorinobuArasakaEmbracingDestruction } from "./yorinobu-arasaka-embracing-destruction.ts";

export { alphaGoroTakemuraHandsUnclean } from "./goro-takemura-hands-unclean.ts";
export { alphaJackieWellesPourOneOutForMe } from "./jackie-welles-pour-one-out-for-me.ts";
export { alphaSaburoArasakaStubbornPatriach } from "./saburo-arasaka-stubborn-patriach.ts";
export { alphaVCorporateExile } from "./v-corporate-exile.ts";
export { alphaViktorVektorSitDownAndRelax } from "./viktor-vektor-sit-down-and-relax.ts";
export { alphaYorinobuArasakaEmbracingDestruction } from "./yorinobu-arasaka-embracing-destruction.ts";

export const alphaLegends = [
  alphaGoroTakemuraHandsUnclean,
  alphaJackieWellesPourOneOutForMe,
  alphaSaburoArasakaStubbornPatriach,
  alphaVCorporateExile,
  alphaViktorVektorSitDownAndRelax,
  alphaYorinobuArasakaEmbracingDestruction,
] satisfies AlphaCardDefinition[];
