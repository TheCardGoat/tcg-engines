import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionAr } from "./nameless-champion-ar.ts";

/** @covers jk9w4buhwk-a1 */
/** @covers jk9w4buhwk-a2 */
describe("nameless champion ar — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionAr);
});
