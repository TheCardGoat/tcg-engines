import { provePreparedAttack } from "../../../testing/prepared-attack.ts";
import { describe } from "vitest";
import { ignitedStab } from "./ignited-stab.ts";

/** @covers GRkBQ1Uvir-a1 @covers GRkBQ1Uvir-a2 */
describe("Ignited Stab \u2014 resolution", () => {
  provePreparedAttack({ card: ignitedStab, cost: 1, power: 2, bonusPower: 2 });
});
