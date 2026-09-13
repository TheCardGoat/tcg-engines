import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
import { describe } from "vitest";
import { hurricaneSweep } from "./hurricane-sweep.ts";

/** @covers 4V6qKuM7xs-a1 */
describe("Hurricane Sweep \u2014 resolution", () => {
  proveClassBonusEfficiency({ card: hurricaneSweep, printedCost: 5, attack: true });
});
