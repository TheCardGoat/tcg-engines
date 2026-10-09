import { describe } from "vitest";
import { poisedBowman } from "./poised-bowman.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers wkz77mbyj0-a1 */
describe("Poised Bowman Ranged", () => {
  proveRangedAlly({ card: poisedBowman, power: 1, ranged: 3, classBonus: false });
});
