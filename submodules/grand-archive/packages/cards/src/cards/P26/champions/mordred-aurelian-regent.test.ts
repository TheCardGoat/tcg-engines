import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { mordredAurelianRegent } from "./mordred-aurelian-regent.ts";

/** @covers XPl2UAO9se-a1 */
describe("Mordred, Aurelian Regent — Lineage restriction", () => {
  proveChampionLineage({
    card: mordredAurelianRegent,
    lineageName: "Mordred",
    level: 3,
    memoryCost: 3,
  });
});
