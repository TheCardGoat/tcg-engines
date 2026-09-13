import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { tidalSweep } from "./tidal-sweep.ts";

/** @covers GuDKuPKNgh-a2 */
describe("Tidal Sweep — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: tidalSweep });
});
