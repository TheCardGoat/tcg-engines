import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionGw } from "./nameless-champion-gw.ts";

/** @covers j9fiu22ltl-a1 */
/** @covers j9fiu22ltl-a2 */
describe("nameless champion gw — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionGw);
});
