import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { gunsmithsArsenal } from "./gunsmiths-arsenal.ts";

/** @covers e6mAjsbItw-a1 */
describe("Gunsmith's Arsenal — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: gunsmithsArsenal, discount: 2 });
});
