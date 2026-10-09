import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { aeneanSwellingTides } from "./aenean-swelling-tides.ts";

/** @covers 10zrMmtUg2-a3 */
describe("Aenean Swelling Tides — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: aeneanSwellingTides });
});

import { proveRecoveryActionBoundaries } from "../../../testing/recovery-action-boundaries.ts";
/** @covers 10zrMmtUg2-a1 */
/** @covers 10zrMmtUg2-a2 */
describe("aeneanSwellingTides recovery boundaries", () => {
  proveRecoveryActionBoundaries(aeneanSwellingTides, "tides");
});
