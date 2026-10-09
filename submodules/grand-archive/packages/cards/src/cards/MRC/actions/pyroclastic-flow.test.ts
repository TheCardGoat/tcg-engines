import { describe } from "vitest";
import { pyroclasticFlow } from "./pyroclastic-flow.ts";
import { proveAreaDamageAction } from "../../../testing/area-damage-action.ts";
/** @covers 4wiffei7ch-a1 */
describe("Pyroclastic Flow", () => {
  proveAreaDamageAction({
    card: pyroclasticFlow,
    cost: 4,
    damage: 2,
    bonusDamage: 2,
    hitsOwnChampion: true,
    hitsOpposingChampion: true,
  });
});
