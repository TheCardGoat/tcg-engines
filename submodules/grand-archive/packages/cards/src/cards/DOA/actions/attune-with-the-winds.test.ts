import { proveHarmonizeDraw } from "../../../testing/harmonize-draw.ts";
import { proveAllyBuffAction } from "../../../testing/ally-buff-action.ts";
import { describe } from "vitest";
import { attuneWithTheWinds } from "./attune-with-the-winds.ts";

/** @covers ify06tSEVC-a1 */
describe("Attune with the Winds \u2014 resolution", () => {
  proveAllyBuffAction({
    card: attuneWithTheWinds,
    cost: 3,
    lifeBonus: 1,
    powerBonus: 1,
    permanent: true,
  });
});

/** @covers ify06tSEVC-a2 */
describe("Attune with the Winds \u2014 resolution", () => {
  proveHarmonizeDraw({ card: attuneWithTheWinds, cost: 3 });
});
