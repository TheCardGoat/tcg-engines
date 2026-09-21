import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { lorraineAscendantWings } from "./lorraine-ascendant-wings.ts";

/** @covers 81gvGHkuVb-a1 */
describe("Lorraine, Ascendant Wings — Lineage restriction", () => {
  proveChampionLineage({
    card: lorraineAscendantWings,
    lineageName: "Lorraine",
    level: 4,
    memoryCost: 4,
  });
});
