import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { welcomeToNightCityRetailGorillaArms } from "./gorilla-arms.ts";
import { welcomeToNightCityRetailZetatechFaceplate } from "./zetatech-faceplate.ts";

export { welcomeToNightCityRetailGorillaArms } from "./gorilla-arms.ts";
export { welcomeToNightCityRetailZetatechFaceplate } from "./zetatech-faceplate.ts";

export const welcomeToNightCityRetailGear = [
  welcomeToNightCityRetailGorillaArms,
  welcomeToNightCityRetailZetatechFaceplate,
] satisfies StructuredCardDefinition[];
