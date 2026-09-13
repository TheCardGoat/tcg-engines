import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionCr } from "./nameless-champion-cr.ts";

/** @covers b53ccl9ipn-a1 */
/** @covers b53ccl9ipn-a2 */
describe("nameless champion cr — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionCr);
});
