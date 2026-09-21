import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { aithneSpiritOfFire } from "./aithne-spirit-of-fire.ts";

/** @covers eb3ib5el99-a1 */
describe("Aithne, Spirit of Fire — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: aithneSpiritOfFire });
});
