import { describe } from "vitest";
import { guerrillaAdvantage } from "./guerrilla-advantage.ts";
import { proveRepeatedChampionCounterAction } from "../../../testing/champion-counter-action.ts";
/** @covers JxCzS4XJ3V-a2 */
/** @covers JxCzS4XJ3V-a1 */
describe("guerrillaAdvantage counters and payment", () => {
  proveRepeatedChampionCounterAction(guerrillaAdvantage, "preparation", 2, 4, true);
});

import { proveOpponentCountDiscount } from "../../../testing/opponent-count-discount.ts";
/** @covers JxCzS4XJ3V-a1 */
describe("guerrillaAdvantage — per-opponent cost threshold", () => {
  proveOpponentCountDiscount(guerrillaAdvantage, false);
});
