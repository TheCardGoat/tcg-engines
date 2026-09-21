import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { silvieSlimeSovereign } from "./silvie-slime-sovereign.ts";

/** @covers mdwbkuhtjm-a1 */
describe("Silvie, Slime Sovereign — Lineage restriction", () => {
  proveChampionLineage({
    card: silvieSlimeSovereign,
    lineageName: "Silvie",
    level: 3,
    memoryCost: 3,
  });
});
