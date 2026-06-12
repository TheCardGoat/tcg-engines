import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";
import { spoilerGorillaArms } from "./gorilla-arms.ts";
import { spoilerZetatechFaceplate } from "./zetatech-faceplate.ts";

export { spoilerGorillaArms } from "./gorilla-arms.ts";
export { spoilerZetatechFaceplate } from "./zetatech-faceplate.ts";

export const spoilerGear = [
  spoilerGorillaArms,
  spoilerZetatechFaceplate,
] satisfies SpoilerCardDefinition[];
