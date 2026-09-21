import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { tristanHiredBlade } from "./tristan-hired-blade.ts";

/** @covers gt7lh9v221-a1 */
describe("Tristan, Hired Blade — Lineage restriction", () => {
  proveChampionLineage({
    card: tristanHiredBlade,
    lineageName: "Tristan",
    level: 2,
    memoryCost: 2,
  });
});
