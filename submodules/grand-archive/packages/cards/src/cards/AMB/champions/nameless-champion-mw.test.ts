import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionMw } from "./nameless-champion-mw.ts";

/** @covers thaqwi9apy-a1 */
/** @covers thaqwi9apy-a2 */
describe("nameless champion mw — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionMw);
});
