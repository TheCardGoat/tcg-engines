import { proveAreaDamageAction } from "../../../testing/area-damage-action.ts";
import { describe } from "vitest";
import { purgeInFlames } from "./purge-in-flames.ts";

/** @covers uTBsOYf15p-a2 */
describe("Purge in Flames \u2014 resolution", () => {
  proveAreaDamageAction({
    card: purgeInFlames,
    cost: 8,
    damage: 2,
    bonusDamage: 3,
    hitsOpposingChampion: true,
  });
});
