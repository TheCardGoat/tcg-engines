import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { guoJiaBlessedScion } from "./guo-jia-blessed-scion.ts";

/** @covers 59ipqa91r2-a1 */
describe("Guo Jia, Blessed Scion — Lineage restriction", () => {
  proveChampionLineage({
    card: guoJiaBlessedScion,
    lineageName: "Guo Jia",
    level: 2,
    memoryCost: 2,
  });
});
