import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { sabrinaSpiritOfWater } from "./sabrina-spirit-of-water.ts";

/** @covers tk3ir1o0qt-a1 */
describe("Sabrina, Spirit of Water — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: sabrinaSpiritOfWater });
});
