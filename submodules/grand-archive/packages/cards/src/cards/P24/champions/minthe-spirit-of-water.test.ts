import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { mintheSpiritOfWater } from "./minthe-spirit-of-water.ts";

/** @covers tiynu4lxnj-a1 */
describe("Minthe, Spirit of Water — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: mintheSpiritOfWater });
});
