import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { priscillaLostSpirit } from "./priscilla-lost-spirit.ts";

/** @covers 2zr5ys29xx-a1 */
describe("Priscilla, Lost Spirit — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: priscillaLostSpirit });
});
