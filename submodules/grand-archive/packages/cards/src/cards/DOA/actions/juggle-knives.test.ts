import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { describe } from "vitest";
import { juggleKnives } from "./juggle-knives.ts";

/** @covers 7VxRE6HgZC-a1 */
describe("Juggle Knives \u2014 resolution", () => {
  proveFixedDamageAction({
    card: juggleKnives,
    cost: 2,
    damage: 1,
    targetKind: "champion",
    classBonus: false,
    draw: 0,
  });
});

/** @covers 7VxRE6HgZC-a2 */
describe("Class Bonus enabled", () => {
  proveFixedDamageAction({
    card: juggleKnives,
    cost: 2,
    damage: 1,
    targetKind: "champion",
    classBonus: true,
    draw: 1,
  });
});
