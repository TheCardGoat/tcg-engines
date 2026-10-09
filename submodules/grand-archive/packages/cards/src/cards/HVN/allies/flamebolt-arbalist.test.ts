import { describe } from "vitest";
import { flameboltArbalist } from "./flamebolt-arbalist.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 5yw862q547-a1 */
describe("Flamebolt Arbalist Ranged", () => {
  proveRangedAlly({ card: flameboltArbalist, power: 2, ranged: 4, classBonus: false });
});
