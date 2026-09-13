import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { cellVanguard } from "./cell-vanguard.ts";

/** @covers 3qiwqjt0oo-a2 */
describe("Cell Vanguard — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: cellVanguard });
});
