import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { danteHematicOverdrive } from "./dante-hematic-overdrive.ts";

/** @covers MG4zUMPqIC-a1 */
describe("Dante, Hematic Overdrive — Lineage restriction", () => {
  proveChampionLineage({
    card: danteHematicOverdrive,
    lineageName: "Dante",
    level: 4,
    memoryCost: 4,
  });
});
