import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { jianyuFatesPremonition } from "./jianyu-fates-premonition.ts";

/** @covers qv0vn6tuow-a1 */
describe("Jianyu, Fate's Premonition — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: jianyuFatesPremonition, discount: 2 });
});

import { proveAsEntersChoice } from "../../../testing/as-enters-choice.ts";
/** @covers qv0vn6tuow-a2 */
describe("jianyuFatesPremonition — entry choice", () => {
  proveAsEntersChoice(jianyuFatesPremonition, "name");
});

import { proveChosenActivationTax } from "../../../testing/chosen-activation-tax.ts";
/** @covers qv0vn6tuow-a3 */
describe("jianyuFatesPremonition — chosen activation tax", () => {
  proveChosenActivationTax(jianyuFatesPremonition, "name");
});
