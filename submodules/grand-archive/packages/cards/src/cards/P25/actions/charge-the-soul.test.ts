import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { chargeTheSoul } from "./charge-the-soul.ts";

/** @covers ra9950o14t-a2 */
describe("Charge the Soul — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: chargeTheSoul });
});
