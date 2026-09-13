import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { proveRestedEntry } from "../../../testing/rested-entry.ts";
import { describe, expect, it } from "vitest";
import { rebelliousBull } from "./rebellious-bull.ts";

/** @covers GXeEa0pe3B-a1 */
describe("Rebellious Bull \u2014 resolution", () => {
  proveRestedEntry({ card: rebelliousBull, cost: { kind: "reserve", amount: 5 } });
});
/** @covers GXeEa0pe3B-a2 */
describe("Rebellious Bull's Pride", () => {
  for (const level of [2, 3])
    it(`obeys after waking only with champion level ${level}`, () => {
      const champion = grantTestChampionLevel(
        createClassBonusTestChampion(rebelliousBull, false, "activation-discount"),
        level,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [rebelliousBull], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      const before = game.state;
      if (level < 3) {
        expect(() => p.declareAttack(rebelliousBull, q.card(champion))).toThrow();
        expect(game.state).toEqual(before);
      } else {
        p.declareAttack(rebelliousBull, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
      }
    });
});
