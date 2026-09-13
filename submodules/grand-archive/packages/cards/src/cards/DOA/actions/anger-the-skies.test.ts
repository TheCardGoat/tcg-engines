import { proveAreaDamageAction } from "../../../testing/area-damage-action.ts";
import { describe } from "vitest";
import { angerTheSkies } from "./anger-the-skies.ts";

/** @covers wOKw0q4SZR-a1 */
describe("Anger the Skies \u2014 resolution", () => {
  proveAreaDamageAction({
    card: angerTheSkies,
    cost: 3,
    damage: 3,
    bonusDamage: 4,
    hitsOpposingChampion: false,
  });
});
