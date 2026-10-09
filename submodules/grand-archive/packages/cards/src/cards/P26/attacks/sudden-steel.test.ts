import { describe } from "vitest";
import { suddenSteel } from "./sudden-steel.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers SSu2eQZFJV-a1 */
describe("suddenSteel — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: suddenSteel, printedCost: 6, attack: true });
});
