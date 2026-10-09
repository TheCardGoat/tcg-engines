import { describe } from "vitest";
import { disintegrate } from "./disintegrate.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers FhbVHkHQRb-a1 */
describe("disintegrate — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: disintegrate, printedCost: 8, targetAlly: true });
});
