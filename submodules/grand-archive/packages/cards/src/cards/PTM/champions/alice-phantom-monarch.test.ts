import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { alicePhantomMonarch } from "./alice-phantom-monarch.ts";

/** @covers emqOANitoD-a1 */
describe("Alice, Phantom Monarch — Lineage restriction", () => {
  proveChampionLineage({
    card: alicePhantomMonarch,
    lineageName: "Alice",
    level: 2,
    memoryCost: 2,
  });
});
