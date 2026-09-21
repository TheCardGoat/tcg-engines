import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { guoJiaHeavensFavored } from "./guo-jia-heavens-favored.ts";

/** @covers enxi6tshtu-a2 */
describe("Guo Jia, Heaven's Favored — Lineage restriction", () => {
  proveChampionLineage({
    card: guoJiaHeavensFavored,
    lineageName: "Guo Jia",
    level: 3,
    memoryCost: 3,
  });
});
