import { describe } from "vitest";
import { cryogenicRitual } from "./cryogenic-ritual.ts";
import { coreFractal } from "../../PRD/tokens/core-fractal.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers FWinA77xF1-a2
 * @covers FWinA77xF1-a1 */
describe("cryogenicRitual", () => {
  proveSummonAction({
    card: cryogenicRitual,
    cost: 2,
    tokens: [{ card: coreFractal, count: 1 }],
    sacrificeAlly: true,
  });
});
