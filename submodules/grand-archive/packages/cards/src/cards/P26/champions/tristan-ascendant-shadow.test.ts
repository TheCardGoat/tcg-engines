import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { tristanAscendantShadow } from "./tristan-ascendant-shadow.ts";

/** @covers sSIDPfkmkw-a1 */
describe("Tristan, Ascendant Shadow — Lineage restriction", () => {
  proveChampionLineage({
    card: tristanAscendantShadow,
    lineageName: "Tristan",
    level: 4,
    memoryCost: 4,
  });
});
