import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { materializeMunitions } from "./materialize-munitions.ts";

/** @covers xi74wa4x7e-a1 */
describe("Materialize Munitions — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: materializeMunitions, discount: 1 });
});
