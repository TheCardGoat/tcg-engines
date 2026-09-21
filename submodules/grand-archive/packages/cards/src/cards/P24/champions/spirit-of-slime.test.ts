import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { spiritOfSlime } from "./spirit-of-slime.ts";

/** @covers 0xp4xq07vv-a1 */
describe("Spirit of Slime — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: spiritOfSlime });
});
