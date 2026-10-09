import { describe } from "vitest";
import { galewindScout } from "./galewind-scout.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 8gv9f4a0nk-a1 */
describe("Galewind Scout Ranged", () => {
  proveRangedAlly({ card: galewindScout, power: 2, ranged: 3, classBonus: false });
});
