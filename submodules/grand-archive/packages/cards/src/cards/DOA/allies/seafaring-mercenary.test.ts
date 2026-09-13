import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { seafaringMercenary } from "./seafaring-mercenary.ts";

/** @covers Bzy2hRKUmR-a1 */
describe("Seafaring Mercenary — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: seafaringMercenary });
});
