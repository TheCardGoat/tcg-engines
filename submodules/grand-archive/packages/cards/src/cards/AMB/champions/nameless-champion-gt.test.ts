import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionGt } from "./nameless-champion-gt.ts";

/** @covers nq6nhjy85f-a1 */
/** @covers nq6nhjy85f-a2 */
describe("nameless champion gt — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionGt);
});
