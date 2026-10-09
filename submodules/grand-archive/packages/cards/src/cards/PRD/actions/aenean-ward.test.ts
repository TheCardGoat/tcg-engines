import { describe, expect, it } from "vitest";
import { aeneanWard } from "./aenean-ward.ts";
import { proveUnitDamagePrevention } from "../../../testing/unit-damage-prevention.ts";
/** @covers gqyWZXpxl9-a1 */
describe("aeneanWard prevention", () => {
  proveUnitDamagePrevention({ card: aeneanWard, cost: 1, capacity: 2 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers gqyWZXpxl9-a2 */
describe("Aenean Ward draw", () => {
  for (const matching of [false, true])
    for (const level of [2, 3])
      it(`draws only with matching class and level 3+, class=${matching}, level=${level}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(aeneanWard, matching, "activation-discount"),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [aeneanWard, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          drawn = p.zone("main-deck")[0]!;
        p.activate(aeneanWard, {
          reservePayment: [
            { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
          targets: { "target-1": [p.card(champion).objectId] },
        });
        expect(p.zone("hand")).toHaveLength(0);
        passEffectsStack(game);
        expect(p.zone("hand")).toEqual(matching && level >= 3 ? [drawn] : []);
        expect(p.zone("memory")).toHaveLength(1);
      });
});
