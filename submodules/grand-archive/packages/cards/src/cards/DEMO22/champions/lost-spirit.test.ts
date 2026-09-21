import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { lostSpirit } from "./lost-spirit.ts";

/** @covers cFdWXaILRT-a1 */
describe("Lost Spirit — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: lostSpirit });
});
