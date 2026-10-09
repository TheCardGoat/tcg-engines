import { describe } from "vitest";
import { chargedGunslinger } from "./charged-gunslinger.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers svdv3zb9p4-a1 */
describe("Charged Gunslinger Ranged", () => {
  proveRangedAlly({ card: chargedGunslinger, power: 1, ranged: 2, classBonus: false });
});
