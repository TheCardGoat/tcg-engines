import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { swordOfAvarice } from "./sword-of-avarice.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers dmbBXRTVIk-a1 */
describe("Sword of Avarice's class-sensitive entry draw", () => {
  for (const classBonus of [false, true])
    it(`draws ${classBonus ? 2 : 1} after materialization`, () => {
      const champion = createClassBonusTestChampion(
        swordOfAvarice,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [swordOfAvarice],
            memory: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.materialize(swordOfAvarice);
      expect(p.zone("memory")).toHaveLength(0);
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      expect(p.zone("hand")).toHaveLength(classBonus ? 2 : 1);
      expect(q.zone("hand")).toHaveLength(0);
      expect(p.cards(swordOfAvarice, { zone: "field" })).toHaveLength(1);
    });
});
