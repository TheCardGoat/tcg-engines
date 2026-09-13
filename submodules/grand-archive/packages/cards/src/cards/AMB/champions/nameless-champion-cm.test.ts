import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionCm } from "./nameless-champion-cm.ts";

/** @covers ztjuymn2ge-a1 */
/** @covers ztjuymn2ge-a2 */
describe("nameless champion cm — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionCm);
});
