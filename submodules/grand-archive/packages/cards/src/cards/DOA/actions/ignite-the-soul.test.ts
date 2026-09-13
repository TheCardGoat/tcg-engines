import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { igniteTheSoul } from "./ignite-the-soul.ts";

/** @covers rXHo9fLU32-a2 */
describe("Ignite the Soul — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: igniteTheSoul });
});

/** @covers rXHo9fLU32-a1 */
describe("Ignite the Soul \u2014 resolution", () => {
  proveFixedDamageAction({ card: igniteTheSoul, cost: 1, damage: 1, targetKind: "unit" });
});
