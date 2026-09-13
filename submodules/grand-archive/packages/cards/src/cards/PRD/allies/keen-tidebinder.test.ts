import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { keenTidebinder } from "./keen-tidebinder.ts";

/** @covers ZmBQAOb9gj-a2 */
describe("Keen Tidebinder — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: keenTidebinder });
});
