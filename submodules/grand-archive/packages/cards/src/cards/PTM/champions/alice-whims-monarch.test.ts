import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { aliceWhimsMonarch } from "./alice-whims-monarch.ts";

/** @covers 9K4etFOi4M-a1 */
describe("Alice, Whim's Monarch — Lineage restriction", () => {
  proveChampionLineage({
    card: aliceWhimsMonarch,
    lineageName: "Alice",
    level: 2,
    memoryCost: 2,
  });
});
