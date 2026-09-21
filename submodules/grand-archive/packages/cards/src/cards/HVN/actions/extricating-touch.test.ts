import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { extricatingTouch } from "./extricating-touch.ts";

/** @covers 4a8hl5dben-a1 */
describe("Extricating Touch — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: extricatingTouch, discount: 1 });
});
