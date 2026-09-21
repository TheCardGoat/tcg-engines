import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { deadlyOpportunist } from "./deadly-opportunist.ts";

/** @covers eyvxonorcs-a2 */
describe("Deadly Opportunist — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: deadlyOpportunist });
});

import { proveAttackingAllyPower } from "../../../testing/attacking-ally-power.ts";
/** @covers eyvxonorcs-a1 */
describe("deadly-opportunist — conditional attack power", () => {
  proveAttackingAllyPower({
    card: deadlyOpportunist,
    basePower: 1,
    bonus: 3,
    requiresRested: true,
  });
});
