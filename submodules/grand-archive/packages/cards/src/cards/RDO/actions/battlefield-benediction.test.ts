import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { battlefieldBenediction } from "./battlefield-benediction.ts";

/** @covers HcR3O8vDps-a1 */
describe("Battlefield Benediction — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: battlefieldBenediction, discount: 1 });
});
