import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionAt } from "./nameless-champion-at.ts";

/** @covers 0794z3ffck-a1 */
/** @covers 0794z3ffck-a2 */
describe("nameless champion at — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionAt);
});
