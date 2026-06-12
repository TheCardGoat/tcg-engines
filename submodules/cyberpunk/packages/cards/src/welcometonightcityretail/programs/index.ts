import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { welcomeToNightCityRetailCarnageAtTheColosseum } from "./carnage-at-the-colosseum.ts";
import { welcomeToNightCityRetailChromeReverie } from "./chrome-reverie.ts";
import { welcomeToNightCityRetailCyberpsychosis } from "./cyberpsychosis.ts";
import { welcomeToNightCityRetailPeaceOffering } from "./peace-offering.ts";

export { welcomeToNightCityRetailCarnageAtTheColosseum } from "./carnage-at-the-colosseum.ts";
export { welcomeToNightCityRetailChromeReverie } from "./chrome-reverie.ts";
export { welcomeToNightCityRetailCyberpsychosis } from "./cyberpsychosis.ts";
export { welcomeToNightCityRetailPeaceOffering } from "./peace-offering.ts";

export const welcomeToNightCityRetailPrograms = [
  welcomeToNightCityRetailCarnageAtTheColosseum,
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailPeaceOffering,
] satisfies StructuredCardDefinition[];
