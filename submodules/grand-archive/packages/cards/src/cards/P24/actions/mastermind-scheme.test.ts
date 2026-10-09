import { describe } from "vitest";
import { mastermindScheme } from "./mastermind-scheme.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers 9lbewemius-a1 */
describe("mastermindScheme — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: mastermindScheme, printedCost: 6 });
});
