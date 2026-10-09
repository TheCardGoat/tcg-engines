import { describe } from "vitest";
import { aeneanCyclone } from "./aenean-cyclone.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers eCxOH7BgsS-a1 */
describe("aeneanCyclone — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: aeneanCyclone, printedCost: 13 });
});
