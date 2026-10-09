import { describe } from "vitest";
import { ashfletchedBowman } from "./ashfletched-bowman.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers vUq1XBaQtU-a1 */
describe("Ashfletched Bowman Ranged", () => {
  proveRangedAlly({ card: ashfletchedBowman, power: 1, ranged: 3, classBonus: false });
});
