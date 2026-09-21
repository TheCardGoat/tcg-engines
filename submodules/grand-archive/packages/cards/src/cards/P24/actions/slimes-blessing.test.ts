import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { slimesBlessing } from "./slimes-blessing.ts";

/** @covers ioxgugw9r9-a1 */
describe("Slime's Blessing — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: slimesBlessing, discount: 1 });
});
