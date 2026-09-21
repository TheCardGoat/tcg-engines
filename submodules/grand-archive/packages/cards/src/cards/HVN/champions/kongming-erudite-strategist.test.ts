import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { kongmingEruditeStrategist } from "./kongming-erudite-strategist.ts";

/** @covers 0i139x5eub-a1 */
describe("Kongming, Erudite Strategist — Lineage restriction", () => {
  proveChampionLineage({
    card: kongmingEruditeStrategist,
    lineageName: "Kongming",
    level: 2,
    memoryCost: 2,
  });
});
