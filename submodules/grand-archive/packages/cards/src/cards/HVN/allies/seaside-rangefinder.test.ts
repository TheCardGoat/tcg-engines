import { describe } from "vitest";
import { seasideRangefinder } from "./seaside-rangefinder.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 5qyee9vkp8-a1 */
describe("Seaside Rangefinder Ranged", () => {
  proveRangedAlly({ card: seasideRangefinder, power: 2, ranged: 2, classBonus: false });
});
