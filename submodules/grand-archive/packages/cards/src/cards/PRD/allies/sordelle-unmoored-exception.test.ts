import { describe } from "vitest";
import { sordelleUnmooredException } from "./sordelle-unmoored-exception.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers ROjhG3L1iy-a1 */
describe("sordelleUnmooredException", () => {
  proveSummonOnEnter({
    card: sordelleUnmooredException,
    token: powercell,
    cost: 3,
    count: 1,
    abilityId: "ROjhG3L1iy-a1",
    rested: true,
  });
});
