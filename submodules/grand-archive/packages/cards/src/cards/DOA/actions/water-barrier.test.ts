import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { waterBarrier } from "./water-barrier.ts";

/** @covers xWJND68I8X-a2 */
describe("Water Barrier — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: waterBarrier });
});
import { proveChampionNextPrevention } from "../../../testing/champion-next-prevention.ts";
/** @covers xWJND68I8X-a1 */
describe("water-barrier only shields the next damage this turn", () => {
  proveChampionNextPrevention({ card: waterBarrier, enlighten: false });
});
