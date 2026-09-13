import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { drownedCut } from "./drowned-cut.ts";

/** @covers 2djBo4ecDL-a1 */
describe("Drowned Cut — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: drownedCut });
});
