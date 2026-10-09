import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { mercilessToss } from "./merciless-toss.ts";

/** @covers ZIU4bH6D9q-a1 */
describe("Merciless Toss — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: mercilessToss, discount: 1 });
});

import { proveTargetStateDamage } from "../../../testing/target-state-damage.ts";
/** @covers ZIU4bH6D9q-a2 */
describe("Merciless Toss — damaged ally bonus", () => proveTargetStateDamage(mercilessToss, true));
