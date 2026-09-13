import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { mistboundWatcher } from "./mistbound-watcher.ts";
/** @covers mA4n0Z7BQz-a1 */
describe("Mistbound Watcher's end phase", () => {
  for (const matching of [true, false])
    it(`requires Class Bonus and the controller's end phase (${matching})`, () => {
      const champion = createClassBonusTestChampion(
        mistboundWatcher,
        matching,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [mistboundWatcher], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        id = p.card(champion).objectId;
      expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(0);
      advanceToMain(game, q.id);
      expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(matching ? 1 : 0);
      advanceToMain(game, p.id);
      expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(matching ? 1 : 0);
      advanceToMain(game, q.id);
      expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(matching ? 2 : 0);
      expect(game.state.objects[q.card(champion).objectId]!.counters.enlighten ?? 0).toBe(0);
    });
});
