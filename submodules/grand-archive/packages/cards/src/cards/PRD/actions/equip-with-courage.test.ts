import { describe } from "vitest";
import { equipWithCourage } from "./equip-with-courage.ts";
import { proveNextAttackBonus } from "../../../testing/next-attack-bonus.ts";
/** @covers eU8IEVpFZg-a1 */
describe("Equip with Courage — linked-item next attack bonus", () =>
  proveNextAttackBonus(equipWithCourage, 2, true));
