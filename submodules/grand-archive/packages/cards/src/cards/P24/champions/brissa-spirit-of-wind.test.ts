import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { brissaSpiritOfWind } from "./brissa-spirit-of-wind.ts";

/** @covers 7wra95faoq-a1 */
describe("Brissa, Spirit of Wind — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: brissaSpiritOfWind });
});
