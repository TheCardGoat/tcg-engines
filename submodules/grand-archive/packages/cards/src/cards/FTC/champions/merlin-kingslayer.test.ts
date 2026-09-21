import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { merlinKingslayer } from "./merlin-kingslayer.ts";

/** @covers rz1bqry41l-a1 */
describe("Merlin, Kingslayer — Lineage restriction", () => {
  proveChampionLineage({
    card: merlinKingslayer,
    lineageName: "Merlin",
    level: 3,
    memoryCost: 3,
  });
});
