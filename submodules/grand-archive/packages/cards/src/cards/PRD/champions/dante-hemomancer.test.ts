import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { danteHemomancer } from "./dante-hemomancer.ts";

/** @covers 4FtNBFaOJp-a1 */
describe("Dante, Hemomancer — Lineage restriction", () => {
  proveChampionLineage({
    card: danteHemomancer,
    lineageName: "Dante",
    level: 3,
    memoryCost: 3,
  });
});
