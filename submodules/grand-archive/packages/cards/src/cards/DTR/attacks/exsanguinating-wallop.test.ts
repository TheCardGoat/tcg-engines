import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { exsanguinatingWallop } from "./exsanguinating-wallop.ts";

/** @covers cicanyx695-a2 */
describe("Exsanguinating Wallop — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: exsanguinatingWallop });
});

import { proveOnAttackRecover } from "../../../testing/on-attack-recover.ts";

/** @covers cicanyx695-a1 */
describe("Exsanguinating Wallop — On Attack recovery", () => {
  proveOnAttackRecover({
    card: exsanguinatingWallop,
    abilityId: "cicanyx695-a1",
    amount: 3,
    attackCost: 5,
    power: 5,
    classRestricted: true,
  });
});
