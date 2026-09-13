import { describe } from "vitest";
import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { spellshieldArcane } from "./spellshield-arcane.ts";

/** @covers RUqtU0Lczf-a1 */
describe("Spellshield: Arcane \u2014 RUqtU0Lczf-a1", () => {
  proveClassBonusActivationDiscount({ card: spellshieldArcane, discount: 1 });
});
import { proveChampionNextPrevention } from "../../../testing/champion-next-prevention.ts";
/** @covers RUqtU0Lczf-a2 */
describe("spellshield-arcane only shields the next damage this turn", () => {
  proveChampionNextPrevention({ card: spellshieldArcane, enlighten: true });
});
