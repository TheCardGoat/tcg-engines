import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { gearshiftBlock } from "./gearshift-block.ts";

/** @covers ej4mcnqsm3-a1 */
describe("Gearshift Block — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: gearshiftBlock, discount: 1 });
});
