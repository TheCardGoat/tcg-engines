import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { spiritOfChess } from "./spirit-of-chess.ts";

/** @covers AYe0neu31W-a1 */
describe("Spirit of Chess — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: spiritOfChess });
});
