import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { spellshieldExia } from "./spellshield-exia.ts";

/** @covers CSVtYQIz7h-a1 */
describe("Spellshield: Exia — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: spellshieldExia, discount: 2 });
});
