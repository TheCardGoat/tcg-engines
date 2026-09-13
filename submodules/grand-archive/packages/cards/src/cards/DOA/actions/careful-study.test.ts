import { proveChampionCounterAction } from "../../../testing/champion-counter-action.ts";
import { describe } from "vitest";
import { carefulStudy } from "./careful-study.ts";

/** @covers 4NkVdSx9ed-a2 */
describe("Careful Study \u2014 resolution", () => {
  proveChampionCounterAction({ card: carefulStudy, cost: 8, counter: "enlighten", amount: 5 });
});
