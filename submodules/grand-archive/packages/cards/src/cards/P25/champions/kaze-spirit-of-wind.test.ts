import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { kazeSpiritOfWind } from "./kaze-spirit-of-wind.ts";

/** @covers FwXm0Bb6di-a1 */
describe("Kaze, Spirit of Wind — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: kazeSpiritOfWind });
});
