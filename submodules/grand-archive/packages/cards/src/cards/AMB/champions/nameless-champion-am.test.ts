import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionAm } from "./nameless-champion-am.ts";

/** @covers pv6ichyxj0-a1 */
/** @covers pv6ichyxj0-a2 */
describe("nameless champion am — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionAm);
});
