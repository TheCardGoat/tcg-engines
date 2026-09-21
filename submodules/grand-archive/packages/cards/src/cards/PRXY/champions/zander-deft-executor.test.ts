import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { zanderDeftExecutor } from "./zander-deft-executor.ts";

/** @covers fc4ic5fmaa-a1 */
describe("Zander, Deft Executor — Lineage restriction", () => {
  proveChampionLineage({
    card: zanderDeftExecutor,
    lineageName: "Zander",
    level: 2,
    memoryCost: 2,
  });
});
