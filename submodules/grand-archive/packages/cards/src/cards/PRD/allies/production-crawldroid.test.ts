import { describe } from "vitest";
import { productionCrawldroid } from "./production-crawldroid.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers AVgvV2L2k7-a1 */
describe("productionCrawldroid", () => {
  proveSummonOnEnter({
    card: productionCrawldroid,
    token: powercell,
    cost: 3,
    count: 2,
    abilityId: "AVgvV2L2k7-a1",
  });
});
