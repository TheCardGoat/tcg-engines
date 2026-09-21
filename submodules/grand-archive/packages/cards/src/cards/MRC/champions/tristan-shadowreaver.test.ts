import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { tristanShadowreaver } from "./tristan-shadowreaver.ts";

/** @covers 4upufooz13-a1 */
describe("Tristan, Shadowreaver — Lineage restriction", () => {
  proveChampionLineage({
    card: tristanShadowreaver,
    lineageName: "Tristan",
    level: 3,
    memoryCost: 3,
  });
});
