import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { alphaCorporateSurveillance } from "./corporate-surveillance.ts";
import { alphaFloorIt } from "./floor-it.ts";
import { alphaIndustrialAssembly } from "./industrial-assembly.ts";
import { alphaRebootOptics } from "./reboot-optics.ts";

export { alphaCorporateSurveillance } from "./corporate-surveillance.ts";
export { alphaFloorIt } from "./floor-it.ts";
export { alphaIndustrialAssembly } from "./industrial-assembly.ts";
export { alphaRebootOptics } from "./reboot-optics.ts";

export const alphaPrograms = [
  alphaCorporateSurveillance,
  alphaFloorIt,
  alphaIndustrialAssembly,
  alphaRebootOptics,
] satisfies AlphaCardDefinition[];
