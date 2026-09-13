import { proveAllyBuffAction } from "../../../testing/ally-buff-action.ts";
import { describe } from "vitest";
import { songOfNurturing } from "./song-of-nurturing.ts";

/** @covers 4hbA9FT56L-a1 */
describe("Song of Nurturing \u2014 resolution", () => {
  proveAllyBuffAction({ card: songOfNurturing, cost: 2, lifeBonus: 2, powerBonus: 0 });
});

describe("Class Bonus power", () => {
  proveAllyBuffAction({
    card: songOfNurturing,
    cost: 2,
    lifeBonus: 2,
    powerBonus: 1,
    classBonus: true,
  });
});
