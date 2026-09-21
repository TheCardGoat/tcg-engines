import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { gwendolynSpiritOfWind } from "./gwendolyn-spirit-of-wind.ts";

/** @covers 74wa4x7e22-a1 */
describe("Gwendolyn, Spirit of Wind — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: gwendolynSpiritOfWind });
});
