import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { dinahLostSpirit } from "./dinah-lost-spirit.ts";

/** @covers gOus3YnrRq-a1 */
describe("Dinah, Lost Spirit — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: dinahLostSpirit });
});
