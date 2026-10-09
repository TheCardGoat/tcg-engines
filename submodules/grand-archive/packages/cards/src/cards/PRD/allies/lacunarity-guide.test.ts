import { describe } from "vitest";
import { lacunarityGuide } from "./lacunarity-guide.ts";

import { hydratingFractal } from "../../PRD/phantasias/hydrating-fractal.ts";
import { proveSupportedStealth } from "../../../testing/supported-stealth.ts";
/** @covers 6rheGKZGyG-a1 */
describe("lacunarityGuide — supported Stealth", () => {
  proveSupportedStealth(lacunarityGuide, hydratingFractal, true);
});
