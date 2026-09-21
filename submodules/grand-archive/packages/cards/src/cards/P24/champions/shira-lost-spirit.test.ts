import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { shiraLostSpirit } from "./shira-lost-spirit.ts";

/** @covers 1gpd7mbroj-a1 */
describe("Shira, Lost Spirit — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: shiraLostSpirit });
});
