import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { skilledAerotheurge } from "./skilled-aerotheurge.ts";

/** @covers 58xpspudnf-a3 */
describe("Skilled Aerotheurge — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: skilledAerotheurge });
});
