import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { dissuadingHalt } from "./dissuading-halt.ts";

/** @covers y7wbtbasch-a2 */
describe("Dissuading Halt — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: dissuadingHalt });
});
