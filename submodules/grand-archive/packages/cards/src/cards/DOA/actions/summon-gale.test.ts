import { proveReturnAllyAction } from "../../../testing/return-ally-action.ts";
import { describe } from "vitest";
import { summonGale } from "./summon-gale.ts";

/** @covers ZgA7cWNKGy-a2 */
describe("Summon Gale \u2014 resolution", () => {
  proveReturnAllyAction({ card: summonGale, cost: 3 });
});

/** @covers ZgA7cWNKGy-a1 */
describe("Class Bonus Efficiency", () => {
  proveReturnAllyAction({ card: summonGale, cost: 1, classBonus: true, level: 2 });
  proveReturnAllyAction({ card: summonGale, cost: 0, classBonus: true, level: 4 });
  proveReturnAllyAction({ card: summonGale, cost: 3, classBonus: false, level: 4 });
});
