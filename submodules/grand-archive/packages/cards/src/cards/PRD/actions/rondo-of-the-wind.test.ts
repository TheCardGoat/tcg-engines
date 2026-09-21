import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { rondoOfTheWind } from "./rondo-of-the-wind.ts";

/** @covers 4hbW1LvBRr-a1 */
describe("Rondo of the Wind — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: rondoOfTheWind, discount: 1 });
});
