import { proveTemporaryLevelAction } from "../../../testing/temporary-level-action.ts";
import { describe } from "vitest";
import { arcaneSight } from "./arcane-sight.ts";

/** @covers XLrHaYV9VB-a1 */
describe("Arcane Sight \u2014 resolution", () => {
  proveTemporaryLevelAction({ card: arcaneSight, cost: 0, amount: 1, draw: 1 });
});
