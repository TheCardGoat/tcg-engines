import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { fortification } from "./fortification.ts";

/** @covers 6FGKeLTumW-a2 */
describe("Fortification — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: fortification });
});
