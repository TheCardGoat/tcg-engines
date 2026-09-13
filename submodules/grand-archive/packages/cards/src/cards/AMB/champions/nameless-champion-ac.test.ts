import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionAc } from "./nameless-champion-ac.ts";

/** @covers 86flbytki3-a1 */
/** @covers 86flbytki3-a2 */
describe("nameless champion ac — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionAc);
});
