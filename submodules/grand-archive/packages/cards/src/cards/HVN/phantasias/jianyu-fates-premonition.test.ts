import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { jianyuFatesPremonition } from "./jianyu-fates-premonition.ts";

/** @covers qv0vn6tuow-a1 */
describe("Jianyu, Fate's Premonition — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: jianyuFatesPremonition, discount: 2 });
});
