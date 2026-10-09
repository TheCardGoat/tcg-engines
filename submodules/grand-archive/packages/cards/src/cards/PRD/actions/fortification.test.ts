import { describe } from "vitest";
import { fortification } from "./fortification.ts";
import { proveTargetedCounterAction } from "../../../testing/targeted-counter-action.ts";
/** @covers 6FGKeLTumW-a1 */
describe("Fortification — ally and Siegeable domain bulwark", () =>
  proveTargetedCounterAction(fortification, "bulwark"));

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
/** @covers 6FGKeLTumW-a2 */
describe("Fortification — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: fortification });
});
