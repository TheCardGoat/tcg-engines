import { describe } from "vitest";

import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
import { galewhisperRogue } from "./galewhisper-rogue.ts";

/** @covers wnyqmrcwda-a1 */
describe("Galewhisper Rogue — Class Bonus Stealth", () => {
  proveClassBonusStealth(galewhisperRogue);
});
