import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean } from "./goro-takemura-hands-unclean.ts";
import { embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch } from "./saburo-arasaka-stubborn-patriarch.ts";
import { embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction } from "./yorinobu-arasaka-embracing-destruction.ts";

export { embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean } from "./goro-takemura-hands-unclean.ts";
export { embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch } from "./saburo-arasaka-stubborn-patriarch.ts";
export { embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction } from "./yorinobu-arasaka-embracing-destruction.ts";

export const embracingPowerRetailStarterDeckLegends = [
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction,
] satisfies LegendCardDefinition[];
