import { describe } from "vitest";
import { veltechArmiger } from "./veltech-armiger.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 5v9mCHv2qG-a1 */
describe("VelTech Armiger Ranged", () => {
  proveRangedAlly({ card: veltechArmiger, power: 1, ranged: 3, classBonus: false });
});
