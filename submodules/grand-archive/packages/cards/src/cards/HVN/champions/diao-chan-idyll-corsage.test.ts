import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { diaoChanIdyllCorsage } from "./diao-chan-idyll-corsage.ts";

/** @covers d7l6i5thdy-a1 */
describe("Diao Chan, Idyll Corsage — Lineage restriction", () => {
  proveChampionLineage({
    card: diaoChanIdyllCorsage,
    lineageName: "Diao Chan",
    level: 3,
    memoryCost: 3,
  });
});
