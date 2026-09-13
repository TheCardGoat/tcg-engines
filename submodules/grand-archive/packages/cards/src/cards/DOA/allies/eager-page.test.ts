import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { eagerPage } from "./eager-page.ts";
/** @covers jlAc0wWlDZ-a1 */
describe("Eager Page's recollection condition", () => {
  for (const materialize of [true, false])
    it(`materialized this turn=${materialize}`, () => {
      const champion = lineageTestChampion("Page fixture", 0);
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            field: [eagerPage],
            "material-deck": [trainingSword],
            memory: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        id = p.card(eagerPage).objectId;
      if (materialize) {
        p.materialize(trainingSword);
        passEffectsStack(game);
      } else p.execute({ move: "skip-materialization" });
      expect(game.state.objects[id]!.counters.buff ?? 0).toBe(0);
      advanceToMain(game, p.id);
      expect(game.state.objects[id]!.counters.buff ?? 0).toBe(materialize ? 0 : 1);
      advanceToMain(game, q.id);
      expect(game.state.objects[id]!.counters.buff ?? 0).toBe(materialize ? 0 : 1);
      advanceToMain(game, p.id);
      expect(game.state.objects[id]!.counters.buff).toBe(materialize ? 1 : 2);
    });
});
