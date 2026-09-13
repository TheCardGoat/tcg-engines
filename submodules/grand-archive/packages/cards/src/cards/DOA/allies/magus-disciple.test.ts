import { proveDeathDraw } from "../../../testing/death-draw.ts";
import { describe } from "vitest";
import { magusDisciple } from "./magus-disciple.ts";

/** @covers pnDhApDNvR-a1 @covers pnDhApDNvR-a2 */
describe("Magus Disciple \u2014 resolution", () => {
  proveDeathDraw({
    card: magusDisciple,
    abilityId: "pnDhApDNvR-a2",
    classRestricted: true,
    levelBonus: 1,
  });
});
