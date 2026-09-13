import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionGm } from "./nameless-champion-gm.ts";

/** @covers as8yfa8ptg-a1 */
/** @covers as8yfa8ptg-a2 */
describe("nameless champion gm — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionGm);
});
