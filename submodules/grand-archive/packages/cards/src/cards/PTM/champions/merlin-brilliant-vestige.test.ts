import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { merlinBrilliantVestige } from "./merlin-brilliant-vestige.ts";

/** @covers 2TCyILvBYa-a1 */
describe("Merlin, Brilliant Vestige — Lineage restriction", () => {
  proveChampionLineage({
    card: merlinBrilliantVestige,
    lineageName: "Merlin",
    level: 3,
    memoryCost: 3,
  });
});
