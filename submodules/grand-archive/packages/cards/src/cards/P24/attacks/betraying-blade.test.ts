import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { betrayingBlade } from "./betraying-blade.ts";

/** @covers qwxvzfkpaj-a2 */
describe("Betraying Blade — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: betrayingBlade });
});
