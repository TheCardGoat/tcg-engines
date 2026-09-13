import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { takePoint } from "./take-point.ts";

/** @covers 098kmoi0a5-a2 */
describe("Take Point — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: takePoint });
});
