import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { updraftSlice } from "./updraft-slice.ts";

/** @covers k5RG5TNLAp-a2 */
describe("Updraft Slice — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: updraftSlice });
});
