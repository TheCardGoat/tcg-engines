import { describe } from "vitest";
import { genuflectingExecution } from "./genuflecting-execution.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers iqzaNLhqk4-a1 */
describe("genuflectingExecution — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: genuflectingExecution, printedCost: 7 });
});
