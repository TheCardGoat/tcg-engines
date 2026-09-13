import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionCg } from "./nameless-champion-cg.ts";

/** @covers k7sz76vn6u-a1 */
/** @covers k7sz76vn6u-a2 */
describe("nameless champion cg — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionCg);
});
