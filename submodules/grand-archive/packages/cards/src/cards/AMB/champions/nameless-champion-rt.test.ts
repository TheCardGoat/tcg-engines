import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionRt } from "./nameless-champion-rt.ts";

/** @covers mic7hijxlg-a1 */
/** @covers mic7hijxlg-a2 */
describe("nameless champion rt — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionRt);
});
