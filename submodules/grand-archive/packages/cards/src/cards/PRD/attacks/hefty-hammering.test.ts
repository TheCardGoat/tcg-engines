import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { heftyHammering } from "./hefty-hammering.ts";

/** @covers ceqDwfTzFI-a2 */
describe("Hefty Hammering — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: heftyHammering });
});
