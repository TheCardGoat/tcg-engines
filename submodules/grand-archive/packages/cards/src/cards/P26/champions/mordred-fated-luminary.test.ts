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

import { proveSameLevelChampion } from "../../../testing/same-level-champion.ts";
/** @covers KqBosnU7pU-a2 */
describe("Mordred, Fated Luminary — same-base-level permission and draw", () => {
  proveSameLevelChampion(mordredFatedLuminary, "Mordred");
});
