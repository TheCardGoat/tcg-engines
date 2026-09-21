import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { danteAeneanInitiate } from "./dante-aenean-initiate.ts";

/** @covers 84YTQPTvar-a1 */
describe("Dante, Aenean Initiate — Lineage restriction", () => {
  proveChampionLineage({
    card: danteAeneanInitiate,
    lineageName: "Dante",
    level: 2,
    memoryCost: 2,
  });
});
