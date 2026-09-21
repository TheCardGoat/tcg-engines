import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { lorraineArclightSaber } from "./lorraine-arclight-saber.ts";

/** @covers x9sSpjpP3G-a1 */
describe("Lorraine, Arclight Saber — Lineage restriction", () => {
  proveChampionLineage({
    card: lorraineArclightSaber,
    lineageName: "Lorraine",
    level: 3,
    memoryCost: 3,
  });
});
