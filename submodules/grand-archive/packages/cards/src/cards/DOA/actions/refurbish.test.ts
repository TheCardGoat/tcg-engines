import { proveWeaponDurabilityAction } from "../../../testing/weapon-durability-action.ts";
import { describe } from "vitest";
import { refurbish } from "./refurbish.ts";

/** @covers b43adsk77Y-a1 */
describe("Refurbish \u2014 resolution", () => {
  proveWeaponDurabilityAction({ card: refurbish, cost: 4, amount: 2, swordOnly: true });
});
