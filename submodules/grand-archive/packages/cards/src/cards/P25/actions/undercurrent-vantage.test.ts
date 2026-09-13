import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { undercurrentVantage } from "./undercurrent-vantage.ts";

/** @covers xicxo661ly-a2 */
describe("Undercurrent Vantage — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: undercurrentVantage });
});
