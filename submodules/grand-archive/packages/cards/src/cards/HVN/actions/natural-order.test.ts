import { describe } from "vitest";
import { naturalOrder } from "./natural-order.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers ny1te7hcjm-a1 */
describe("naturalOrder — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: naturalOrder, printedCost: 10 });
});
