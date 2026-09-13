import { describe } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { loneGunslinger } from "./lone-gunslinger.ts";

/** @covers eanl1gxrpx-a2 */
describe("Lone Gunslinger — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: loneGunslinger });
});

/** @covers eanl1gxrpx-a1 */
describe("lone-gunslinger — Ranged", () => {
  proveRangedAlly({ card: loneGunslinger, power: 1, ranged: 1, classBonus: false });
});
