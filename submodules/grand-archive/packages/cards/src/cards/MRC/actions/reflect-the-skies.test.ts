import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { reflectTheSkies } from "./reflect-the-skies.ts";

/** @covers 67duh1cy3g-a1 */
describe("Reflect the Skies — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: reflectTheSkies, discount: 1 });
});
