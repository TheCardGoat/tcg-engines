import { proveTeamStealth } from "../../../testing/team-stealth-action.ts";
import { describe } from "vitest";
import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { shroudInMist } from "./shroud-in-mist.ts";

/** @covers DBJ4DuLABr-a1 */
describe("Shroud in Mist \u2014 DBJ4DuLABr-a1", () => {
  proveClassBonusActivationDiscount({ card: shroudInMist, discount: 2 });
});

/** @covers DBJ4DuLABr-a2 */
describe("shroud-in-mist temporary stealth", () => {
  proveTeamStealth({ card: shroudInMist, cost: 5, championProtected: true });
});
