import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { oceansBlessing } from "./oceans-blessing.ts";

/** @covers 4muq2r6v37-a3 */
describe("Ocean's Blessing — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: oceansBlessing });
});
