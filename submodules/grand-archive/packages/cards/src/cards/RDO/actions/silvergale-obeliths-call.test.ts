import { describe } from "vitest";
import { silvergaleObelithsCall } from "./silvergale-obeliths-call.ts";
import { memoriteObelith } from "../../PTM/tokens/memorite-obelith.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers ZENwsneT5Y-a1 */
describe("silvergaleObelithsCall", () => {
  proveSummonAction({
    card: silvergaleObelithsCall,
    cost: 2,
    tokens: [{ card: memoriteObelith, count: 1 }],
    sheen: 1,
  });
});
