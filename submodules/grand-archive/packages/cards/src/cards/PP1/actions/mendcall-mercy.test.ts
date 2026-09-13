import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { mendcallMercy } from "./mendcall-mercy.ts";

/** @covers 2RKjpzEFV6-a1 */
describe("Mendcall Mercy — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: mendcallMercy, discount: 1 });
});
