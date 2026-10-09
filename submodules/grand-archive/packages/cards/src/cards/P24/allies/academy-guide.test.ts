import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { academyGuide } from "./academy-guide.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers kk39i1f0ht-a1 */
describe("Academy Guide — controller's champion materialization discount", () => {
  for (const own of [false, true])
    for (const opposing of [false, true])
      for (const memory of [0, 1, 2])
        it(`own=${own}, opposing=${opposing}, memory=${memory}`, () => {
          const starter = lineageTestChampion("Guide Fixture", 0),
            next = lineageTestChampion("Guide Fixture", 1);
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion: starter,
              zones: {
                field: own ? [academyGuide] : [],
                graveyard: [academyGuide],
                "material-deck": [next],
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: starter,
              zones: { field: opposing ? [academyGuide] : [], memory: [woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            cost = own ? 0 : 1,
            opponentMemory = q.zone("memory");
          if (memory < cost) {
            const before = game.state;
            expect(() => p.materialize(next)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          p.materialize(next);
          expect(p.zone("memory")).toHaveLength(memory - cost);
          expect(p.zone("banishment")).toHaveLength(cost);
          expect(q.zone("memory")).toEqual(opponentMemory);
          passEffectsStack(game);
          expect(
            game.state.objects[p.card(starter, { zone: "field" }).objectId]!.activeDefinitionId,
          ).toBe(next.canonicalId);
        });
});
