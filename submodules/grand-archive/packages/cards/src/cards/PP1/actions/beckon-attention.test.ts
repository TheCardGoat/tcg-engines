import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { beckonAttention } from "./beckon-attention.ts";

/** @covers rTesQpssPz-a1 */
describe("Beckon Attention — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: beckonAttention, discount: 2 });
});
