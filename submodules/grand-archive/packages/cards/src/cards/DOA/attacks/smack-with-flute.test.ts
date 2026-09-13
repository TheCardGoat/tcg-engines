import { proveOnAttackLevel } from "../../../testing/on-attack-level.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { smackWithFlute } from "./smack-with-flute.ts";

/** @covers zpkcFs72Ah-a2 */
describe("Smack with Flute — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: smackWithFlute });
});

/** @covers zpkcFs72Ah-a1 */
describe("Smack with Flute \u2014 resolution", () => {
  proveOnAttackLevel({ card: smackWithFlute, abilityId: "zpkcFs72Ah-a1", mode: "attack", cost: 2 });
});
