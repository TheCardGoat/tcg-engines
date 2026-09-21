import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { lorraineBlademaster } from "./lorraine-blademaster.ts";

/** @covers TJTeWcZnsQ-a1 */
describe("Lorraine, Blademaster — Lineage restriction", () => {
  proveChampionLineage({
    card: lorraineBlademaster,
    lineageName: "Lorraine",
    level: 2,
    memoryCost: 2,
  });
});
