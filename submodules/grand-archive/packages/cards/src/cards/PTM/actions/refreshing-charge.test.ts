import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { refreshingCharge } from "./refreshing-charge.ts";

/** @covers TZxw1pPmHD-a2 */
describe("Refreshing Charge — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: refreshingCharge });
});
