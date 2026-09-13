import { proveReturnAllyAction } from "../../../testing/return-ally-action.ts";
import { describe } from "vitest";
import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { songOfReturn } from "./song-of-return.ts";

/** @covers MwXulmKsIg-a1 */
describe("Song of Return \u2014 MwXulmKsIg-a1", () => {
  proveClassBonusActivationDiscount({ card: songOfReturn, discount: 1 });
});

/** @covers MwXulmKsIg-a2 */
describe("Song of Return \u2014 resolution", () => {
  proveReturnAllyAction({ card: songOfReturn, cost: 3, controlledOnly: true, upTo: 2 });
});
