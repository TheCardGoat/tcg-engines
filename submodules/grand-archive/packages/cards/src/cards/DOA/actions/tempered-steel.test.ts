import { proveWeaponDurabilityAction } from "../../../testing/weapon-durability-action.ts";
import { describe } from "vitest";
import { temperedSteel } from "./tempered-steel.ts";

/** @covers vyRjDql0TR-a1 */
describe("Tempered Steel \u2014 resolution", () => {
  proveWeaponDurabilityAction({ card: temperedSteel, cost: 1, amount: 1, swordOnly: false });
});
