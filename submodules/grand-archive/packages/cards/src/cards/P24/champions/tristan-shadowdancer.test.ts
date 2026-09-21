import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { cardiacVessel } from "../../PRD/phantasias/cardiac-vessel.ts";
import { tristanShadowdancer } from "./tristan-shadowdancer.ts";

/** @covers he6kd7hocc-a1 */
describe("Tristan, Shadowdancer — Lineage restriction", () => {
  proveChampionLineage({
    card: tristanShadowdancer,
    lineageName: "Tristan",
    level: 3,
    memoryCost: 3,
    announceTargets: (game) => ({
      "target-1": [game.player("player-one").card(cardiacVessel, { zone: "field" }).objectId],
    }),
  });
});
