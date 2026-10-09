import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { corsairCaptain } from "./corsair-captain.ts";

/** @covers 4e1gqwah01-a2 */
describe("Corsair Captain — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: corsairCaptain });
});

/** @covers 4e1gqwah01-a1 */
describe("Corsair Captain Ranged", () => {
  proveRangedAlly({ card: corsairCaptain, power: 1, ranged: 2, classBonus: false });
});
