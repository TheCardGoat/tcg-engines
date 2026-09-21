import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { rivetingWinds } from "./riveting-winds.ts";

/** @covers 6Yvt2ZTjRD-a1 */
describe("Riveting Winds — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: rivetingWinds, discount: 2 });
});
