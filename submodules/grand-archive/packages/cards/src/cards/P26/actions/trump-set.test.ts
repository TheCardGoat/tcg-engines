import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { trumpSet } from "./trump-set.ts";

/** @covers w7g91ru45w-a1 */
describe("Trump Set — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: trumpSet, discount: 1 });
});
