import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { spellshieldExia } from "./spellshield-exia.ts";

/** @covers CSVtYQIz7h-a1 */
describe("Spellshield: Exia — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: spellshieldExia, discount: 2 });
});

import { provePreventionFollowUp } from "../../../testing/prevention-follow-up.ts";
/** @covers CSVtYQIz7h-a2 */
describe("spellshield-exia — prevention follow-up", () => {
  provePreventionFollowUp({ card: spellshieldExia, baseCost: 4, recover: true });
});
