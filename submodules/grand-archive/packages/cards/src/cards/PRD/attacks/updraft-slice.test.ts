import { proveAttackPower } from "../../../testing/attack-power.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { updraftSlice } from "./updraft-slice.ts";

/** @covers k5RG5TNLAp-a2 */
describe("Updraft Slice — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: updraftSlice });
});

/** @covers k5RG5TNLAp-a1 */
describe("Updraft Slice Class Bonus", () => {
  for (const classBonus of [false, true])
    for (const level of [0, 1, 3])
      proveAttackPower({
        card: updraftSlice,
        classBonus,
        level,
        cost: 2,
        power: 2 + (classBonus ? 1 : 0),
      });
});
