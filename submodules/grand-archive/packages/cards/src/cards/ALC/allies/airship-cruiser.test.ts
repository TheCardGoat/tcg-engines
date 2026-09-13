import { describe } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { airshipCruiser } from "./airship-cruiser.ts";

/** @covers 609g44vm5k-a2 */
describe("Airship Cruiser — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: airshipCruiser });
});

/** @covers 609g44vm5k-a1 */
describe("airship-cruiser — Ranged", () => {
  proveRangedAlly({ card: airshipCruiser, power: 1, ranged: 2, classBonus: false });
});
