import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { gearshiftBlock } from "./gearshift-block.ts";

/** @covers ej4mcnqsm3-a1 */
describe("Gearshift Block — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: gearshiftBlock, discount: 1 });
});

import { proveTargetNextPrevention } from "../../../testing/target-next-prevention.ts";
/** @covers ej4mcnqsm3-a2 */
describe("gearshift-block — next damage", () => {
  proveTargetNextPrevention({ card: gearshiftBlock, cost: 3, capacity: 99, ownAlly: true });
});
