import { proveClassBonusVigor } from "../../../testing/class-bonus-vigor.ts";
import { describe } from "vitest";
import { windriderVanguard } from "./windrider-vanguard.ts";

/** @covers JEOxGQppTE-a1 */
describe("Windrider Vanguard \u2014 resolution", () => {
  proveClassBonusVigor(windriderVanguard);
});
