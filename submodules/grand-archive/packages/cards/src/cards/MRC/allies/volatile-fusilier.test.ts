import { describe } from "vitest";
import { volatileFusilier } from "./volatile-fusilier.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers m3n9yvn1uo-a1 */
describe("Volatile Fusilier Ranged", () => {
  proveRangedAlly({ card: volatileFusilier, power: 1, ranged: 2, classBonus: false });
});
