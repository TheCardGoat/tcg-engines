import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { lorraineHonedOperative } from "./lorraine-honed-operative.ts";

/** @covers UsX7t4lXfX-a1 */
describe("Lorraine, Honed Operative — Lineage restriction", () => {
  proveChampionLineage({
    card: lorraineHonedOperative,
    lineageName: "Lorraine",
    level: 2,
    memoryCost: 2,
  });
});
