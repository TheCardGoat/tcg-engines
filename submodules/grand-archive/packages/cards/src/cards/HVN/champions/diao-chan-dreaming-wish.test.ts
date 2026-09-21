import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { diaoChanDreamingWish } from "./diao-chan-dreaming-wish.ts";

/** @covers pknaxnn0xo-a1 */
describe("Diao Chan, Dreaming Wish — Lineage restriction", () => {
  proveChampionLineage({
    card: diaoChanDreamingWish,
    lineageName: "Diao Chan",
    level: 2,
    memoryCost: 2,
  });
});
