import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionMr } from "./nameless-champion-mr.ts";

/** @covers 9tmr8iel1m-a1 */
/** @covers 9tmr8iel1m-a2 */
describe("nameless champion mr — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionMr);
});
