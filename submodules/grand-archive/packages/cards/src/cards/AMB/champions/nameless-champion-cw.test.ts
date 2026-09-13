import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionCw } from "./nameless-champion-cw.ts";

/** @covers f4rlv5dsrb-a1 */
/** @covers f4rlv5dsrb-a2 */
describe("nameless champion cw — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionCw);
});
