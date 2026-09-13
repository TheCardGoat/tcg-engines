import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { tacticalRetreat } from "./tactical-retreat.ts";

/** @covers sn0ye3aebj-a2 */
describe("Tactical Retreat — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: tacticalRetreat });
});
