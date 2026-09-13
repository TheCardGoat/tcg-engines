import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { evanescentWinds } from "./evanescent-winds.ts";

/** @covers 90i1prp63s-a2 */
describe("Evanescent Winds — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: evanescentWinds });
});
