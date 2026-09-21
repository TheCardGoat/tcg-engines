import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { miaoSpiritOfWater } from "./miao-spirit-of-water.ts";

/** @covers U5rkT0JRzC-a1 */
describe("Miao, Spirit of Water — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: miaoSpiritOfWater });
});
