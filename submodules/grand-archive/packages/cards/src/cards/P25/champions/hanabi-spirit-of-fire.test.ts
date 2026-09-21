import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { hanabiSpiritOfFire } from "./hanabi-spirit-of-fire.ts";

/** @covers vnz9HSvVUZ-a1 */
describe("Hanabi, Spirit of Fire — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: hanabiSpiritOfFire });
});
