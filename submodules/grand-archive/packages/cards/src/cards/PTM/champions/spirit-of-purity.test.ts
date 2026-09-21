import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { spiritOfPurity } from "./spirit-of-purity.ts";

/** @covers FUCJA8IAMi-a1 */
describe("Spirit of Purity — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: spiritOfPurity });
});
