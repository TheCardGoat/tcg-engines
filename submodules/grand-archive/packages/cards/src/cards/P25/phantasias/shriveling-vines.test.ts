import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { shrivelingVines } from "./shriveling-vines.ts";

/** @covers 6gt6zkly69-a1 */
describe("Shriveling Vines — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: shrivelingVines, discount: 2 });
});
