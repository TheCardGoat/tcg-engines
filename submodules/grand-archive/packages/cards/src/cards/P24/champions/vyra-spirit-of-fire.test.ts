import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { vyraSpiritOfFire } from "./vyra-spirit-of-fire.ts";

/** @covers lokqp12mxz-a1 */
describe("Vyra, Spirit of Fire — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: vyraSpiritOfFire });
});
