import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { chamberlainToad } from "./chamberlain-toad.ts";

/** @covers vgu1C2Lw6e-a3 */
describe("Chamberlain Toad — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: chamberlainToad });
});
