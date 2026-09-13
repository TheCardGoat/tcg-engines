import { proveHarmonizeDraw } from "../../../testing/harmonize-draw.ts";
import { proveTemporaryLevelAction } from "../../../testing/temporary-level-action.ts";
import { describe } from "vitest";
import { empoweringHarmony } from "./empowering-harmony.ts";

/** @covers Kc5Bktw0yK-a1 */
describe("Empowering Harmony \u2014 resolution", () => {
  proveTemporaryLevelAction({ card: empoweringHarmony, cost: 2, amount: 2, draw: 0 });
});

/** @covers Kc5Bktw0yK-a2 */
describe("Empowering Harmony \u2014 resolution", () => {
  proveHarmonizeDraw({ card: empoweringHarmony, cost: 2 });
});
