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

import { proveSameLevelChampion } from "../../../testing/same-level-champion.ts";
/** @covers 4upufooz13-a2 */
describe("Tristan, Shadowreaver — same-base-level permission and draw", () => {
  proveSameLevelChampion(tristanShadowreaver, "Tristan");
});
