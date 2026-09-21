import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { aliceTriflesRoyalty } from "./alice-trifles-royalty.ts";

/** @covers tzV8YfYdHg-a2 */
describe("Alice, Trifle's Royalty — Lineage restriction", () => {
  proveChampionLineage({
    card: aliceTriflesRoyalty,
    lineageName: "Alice",
    level: 3,
    memoryCost: 3,
  });
});
