import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { cellConverter } from "./cell-converter.ts";

/** @covers eqhj1trn0y-a2 */
describe("Cell Converter — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: cellConverter });
});
