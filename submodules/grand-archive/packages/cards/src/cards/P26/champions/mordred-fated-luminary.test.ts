import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { mordredFatedLuminary } from "./mordred-fated-luminary.ts";

/** @covers KqBosnU7pU-a1 */
describe("Mordred, Fated Luminary — Lineage restriction", () => {
  proveChampionLineage({
    card: mordredFatedLuminary,
    lineageName: "Mordred",
    level: 3,
    memoryCost: 3,
  });
});
