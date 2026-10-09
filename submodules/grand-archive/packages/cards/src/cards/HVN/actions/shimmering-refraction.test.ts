import { describe } from "vitest";
import { shimmeringRefraction } from "./shimmering-refraction.ts";
import { provePhantasiaCountDamage } from "../../../testing/phantasia-count-damage.ts";
/** @covers 1k2jb8mau1-a1 */
describe("shimmeringRefraction damage", () => {
  provePhantasiaCountDamage({ card: shimmeringRefraction, cost: 2, base: 0, championOnly: false });
});
